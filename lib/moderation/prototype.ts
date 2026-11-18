import { createDemoSeed, type RepositorySeed } from "../data/in-memory.ts";
import {
  assertTransition, DomainError, validateIntegrity,
  type AuditEvent, type CitySlug, type Listing, type ListingStatus, type ModerationDecision, type Submission,
} from "../domain/model.ts";
import { isMockCity, permitsMockAction, type ModerationAction } from "./policy.ts";

type ReasonCode = "meets-demo-policy" | "missing-demo-details" | "outside-demo-scope" | "ready-for-resubmission";
type Failure = "invalid" | "forbidden" | "not_found" | "stale" | "illegal_transition" | "request_conflict";
type Command = {
  readonly requestId: string;
  readonly actorRef: string;
  readonly city: CitySlug;
  readonly listingId: string;
  readonly action: ModerationAction;
  readonly expectedRevision: number;
  readonly occurredAt: string;
  readonly reasonCode?: ReasonCode;
};
type ModerationAudit = AuditEvent & {
  readonly requestId: string;
  readonly cityId: CitySlug;
  readonly action: ModerationAction;
  readonly targetType: "listing";
  readonly from: ListingStatus;
  readonly status: ListingStatus;
  readonly revision: number;
  readonly submissionId: string;
  readonly decision?: ModerationDecision["outcome"];
  readonly reasonCode?: ReasonCode;
};
type Receipt = { readonly listing: Listing; readonly event: ModerationAudit };
type Result = { ok: true; replayed: boolean; receipt: Receipt } | { ok: false; code: Failure };
type State = RepositorySeed & {
  readonly submissions: readonly Submission[];
  readonly decisions: readonly ModerationDecision[];
  readonly audits: readonly ModerationAudit[];
  readonly receipts: ReadonlyMap<string, { signature: string; receipt: Receipt }>;
};

const steps = {
  submit: ["draft", "submitted"],
  start_review: ["submitted", "under_review"],
  approve: ["under_review", "approved"],
  reject: ["under_review", "rejected"],
  reconsider: ["rejected", "draft"],
  publish: ["approved", "published"],
} as const satisfies Record<ModerationAction, readonly [ListingStatus, ListingStatus]>;
const reasons: Readonly<Partial<Record<ModerationAction, readonly ReasonCode[]>>> = {
  approve: ["meets-demo-policy"],
  reject: ["missing-demo-details", "outside-demo-scope"],
  reconsider: ["ready-for-resubmission"],
};
const actionNames = Object.keys(steps);
const requestIdPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function createModerationPrototype() {
  const { cities, categories, listings } = createDemoSeed();
  const drafts: Listing[] = listings.map((listing) => ({
    ...listing, id: `review-${listing.id}`, status: "draft", sponsoredExample: false,
  }));
  // One separate unowned draft exercises the owner boundary within an assigned city.
  const owners = new Map(drafts.slice(1).map((listing) => [listing.id, `owner-${listing.cityId}`]));
  let state: State = { cities, categories, listings: drafts, submissions: [], decisions: [], audits: [], receipts: new Map() };
  validateIntegrity(state);

  function inspect(actorRef: unknown, city: unknown) {
    if (!isMockCity(city) || !permitsMockAction(actorRef, city, "view_queue")) return undefined;
    const listings = state.listings.filter((listing) => listing.cityId === city);
    const submissions = state.submissions.filter((item) => listings.some((listing) => listing.id === item.listingId));
    const decisions = state.decisions.filter((item) => submissions.some((submission) => submission.id === item.submissionId));
    return structuredClone({ listings, submissions, decisions, audits: state.audits.filter((event) => event.cityId === city) });
  }

  function apply(command: Command): Result {
    if (!command || typeof command !== "object") return { ok: false, code: "invalid" };
    const { actorRef, city, listingId, action, requestId, expectedRevision, occurredAt, reasonCode } = command;
    if (!isMockCity(city) || !actionNames.includes(action)) return { ok: false, code: "forbidden" };
    const current = state.listings.find((listing) => listing.id === listingId && listing.cityId === city);
    if (!permitsMockAction(actorRef, city, action, current && owners.get(current.id))) return { ok: false, code: "forbidden" };
    if (!current) return { ok: false, code: "not_found" };
    const permittedReasons = reasons[action];
    if (typeof requestId !== "string" || requestId.length > 80 || !requestIdPattern.test(requestId) ||
        !Number.isSafeInteger(expectedRevision) || expectedRevision < 0 || typeof occurredAt !== "string" ||
        (permittedReasons ? !reasonCode || !permittedReasons.includes(reasonCode) : reasonCode !== undefined)) {
      return { ok: false, code: "invalid" };
    }

    const requestKey = `${actorRef}/${requestId}`;
    const signature = JSON.stringify([city, listingId, action, expectedRevision, occurredAt, reasonCode]);
    const previous = state.receipts.get(requestKey);
    if (previous) {
      if (previous.signature !== signature) return { ok: false, code: "request_conflict" };
      return { ok: true, replayed: true, receipt: structuredClone(previous.receipt) };
    }
    if (current.revision !== expectedRevision) return { ok: false, code: "stale" };
    const [from, status] = steps[action];
    if (current.status !== from) return { ok: false, code: "illegal_transition" };
    if (Date.parse(occurredAt) < Date.parse(current.updatedAt)) return { ok: false, code: "invalid" };

    const listing: Listing = { ...current, status, updatedAt: occurredAt, revision: current.revision + 1 };
    const active = state.submissions.findLast((item) => item.listingId === listingId);
    const submission: Submission | undefined = action === "submit"
      ? { id: `${listingId}-submission-${listing.revision}`, listingId, actorRef, status: "submitted", submittedAt: occurredAt }
      : active;
    if (!submission) return { ok: false, code: "illegal_transition" };

    const decision = action === "approve" ? "approved" : action === "reject" ? "rejected" : undefined;
    let submissions = state.submissions;
    let decisions = state.decisions;
    if (action === "submit") submissions = [...submissions, submission];
    if (action === "start_review" || decision) {
      const nextSubmission: Submission = { ...submission, status: decision ? "decided" : "in_review" };
      submissions = submissions.map((item) => item.id === submission.id ? nextSubmission : item);
    }
    if (decision && reasonCode) {
      decisions = [...decisions, {
        id: `${submission.id}-decision`, submissionId: submission.id, actorRef,
        outcome: decision, reasonCode, occurredAt,
      }];
    }

    const event: ModerationAudit = {
      id: `audit-${state.audits.length + 1}`, requestId, actorRef, cityId: city, action,
      targetType: "listing", targetId: listingId, from, status, revision: listing.revision,
      submissionId: submission.id, occurredAt, decision, reasonCode,
    };
    const receipt = { listing, event };
    const candidate: State = {
      ...state, listings: state.listings.map((item) => item.id === listingId ? listing : item),
      submissions, decisions, audits: [...state.audits, event],
      receipts: new Map(state.receipts).set(requestKey, { signature, receipt }),
    };
    assertTransition(current.status, status);
    try {
      validateIntegrity(candidate);
    } catch (error) {
      // Validation runs against the candidate before any state is replaced.
      if (error instanceof DomainError) return { ok: false, code: "invalid" };
      throw error;
    }
    state = candidate;
    return { ok: true, replayed: false, receipt: structuredClone(receipt) };
  }

  return { apply, inspect };
}
