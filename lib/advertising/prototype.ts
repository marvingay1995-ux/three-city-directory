import { disclosure, knownCity, placementIssue, reviewCreative, validTime, type Creative, type ReviewDecision, type Slot } from "./policy.ts";
import type { CitySlug, CategorySlug } from "../directory.ts";

export type CampaignStatus = "draft" | "submitted" | "under_review" | ReviewDecision["status"] |
  "simulated_scheduled" | "simulated_completed" | "cancelled";
export type Campaign = {
  readonly id: string; readonly city: CitySlug; readonly category?: CategorySlug; readonly slot: Slot;
  readonly placementId: string; readonly listingId: string; readonly creative: Creative;
  readonly startsAt: string; readonly endsAt: string; readonly updatedAt: string;
  readonly revision: number; readonly status: CampaignStatus; readonly review?: ReviewDecision;
};
type Action = "submit" | "start_review" | "decide" | "schedule" | "complete" | "cancel";
type Command = { requestId: string; campaignId: string; city: CitySlug; action: Action; expectedRevision: number; at: string };
type Failure = "invalid" | "unknown_city" | "not_found" | "stale" | "illegal_transition" |
  "ineligible" | "outside_window" | "slot_conflict" | "request_conflict";
type Result = { ok: true; replayed: boolean; campaign: Campaign } | { ok: false; code: Failure };

const source: Readonly<Record<Action, readonly CampaignStatus[]>> = {
  submit: ["draft"], start_review: ["submitted"], decide: ["under_review"], schedule: ["approved"],
  complete: ["simulated_scheduled"],
  cancel: ["draft", "submitted", "under_review", "approved", "blocked", "simulated_scheduled"],
};
const next = {
  submit: "submitted", start_review: "under_review", schedule: "simulated_scheduled",
  complete: "simulated_completed", cancel: "cancelled",
} as const;

type Fixture = Pick<Campaign, "id" | "city" | "category" | "slot" | "placementId" | "listingId">;
function draft(input: Fixture, rights: Creative["rights"] = "fixture-cleared"): Campaign {
  return {
    ...input, status: "draft", revision: 0, updatedAt: "2026-02-01T00:00:00.000Z",
    startsAt: "2026-02-10T00:00:00.000Z", endsAt: "2026-02-11T00:00:00.000Z",
    creative: {
      id: `creative-${input.id}`, city: input.city, listingId: input.listingId, disclosure,
      content: "fictional-profile", source: "fixture", rights, destination: "offline-reference",
    },
  };
}

export function createAdvertisingPrototype() {
  const dubai = { city: "dubai", category: "creative", listingId: "d1", placementId: "dubai-creative", slot: "category-panel" } as const;
  let campaigns = [
    draft({ ...dubai, id: "dubai-first" }),
    draft({ ...dubai, id: "dubai-alternate" }),
    draft({ id: "muscat-sample", city: "muscat", category: "lifestyle", listingId: "m2",
      placementId: "muscat-lifestyle", slot: "category-panel" }, "unresolved"),
    draft({ id: "doha-sample", city: "doha", listingId: "q1",
      placementId: "doha-directory", slot: "directory-panel" }, "denied"),
  ];
  const receipts = new Map<string, { signature: string; campaign: Campaign }>();

  function list(city: unknown): readonly Campaign[] | undefined {
    if (!knownCity(city)) return undefined;
    return structuredClone(campaigns.filter((campaign) => campaign.city === city));
  }

  function apply(command: Command): Result {
    if (!command || typeof command !== "object") return { ok: false, code: "invalid" };
    const { campaignId, city, action, expectedRevision, at, requestId } = command;
    if (!knownCity(city)) return { ok: false, code: "unknown_city" };
    if (typeof action !== "string" || !Object.hasOwn(source, action) || !validTime(at) ||
        !Number.isSafeInteger(expectedRevision) || expectedRevision < 0 ||
        typeof requestId !== "string" || !/^[a-z0-9_-]{1,80}$/.test(requestId)) return { ok: false, code: "invalid" };
    const current = campaigns.find((campaign) => campaign.city === city && campaign.id === campaignId);
    if (!current) return { ok: false, code: "not_found" };

    const key = `${city}/${requestId}`;
    const signature = JSON.stringify([campaignId, action, expectedRevision, at]);
    const receipt = receipts.get(key);
    if (receipt) {
      if (receipt.signature !== signature) return { ok: false, code: "request_conflict" };
      return { ok: true, replayed: true, campaign: structuredClone(receipt.campaign) };
    }
    if (current.revision !== expectedRevision) return { ok: false, code: "stale" };
    if (!source[action].includes(current.status)) return { ok: false, code: "illegal_transition" };
    if (at < current.updatedAt) return { ok: false, code: "invalid" };
    if (action !== "complete" && action !== "cancel" && placementIssue(current, at)) {
      return { ok: false, code: "ineligible" };
    }
    if (action === "schedule") {
      if (current.review?.status !== "approved") return { ok: false, code: "ineligible" };
      if (at > current.startsAt) return { ok: false, code: "outside_window" };
      const occupied = campaigns.some((other) => other.city === city && other.id !== campaignId &&
        other.placementId === current.placementId &&
        (other.status === "simulated_scheduled" || other.status === "simulated_completed") &&
        current.startsAt < other.endsAt && other.startsAt < current.endsAt);
      if (occupied) return { ok: false, code: "slot_conflict" };
    }
    if (action === "complete" && at < current.endsAt) return { ok: false, code: "outside_window" };

    let review = current.review;
    let status: CampaignStatus;
    if (action === "decide") {
      review = reviewCreative(current, current.creative, at);
      status = review.status;
    } else {
      status = next[action];
    }
    const updated: Campaign = { ...current, review, status, revision: current.revision + 1, updatedAt: at };
    const detached = structuredClone(updated);
    campaigns = campaigns.map((campaign) => campaign === current ? updated : campaign);
    receipts.set(key, { signature, campaign: updated });
    return { ok: true, replayed: false, campaign: detached };
  }

  return { list, apply };
}
