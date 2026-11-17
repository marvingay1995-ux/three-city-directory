/**
 * Phase 3: pure, deterministic directory domain. There is no IO, authentication,
 * production persistence, advertising delivery or public mutation endpoint here.
 */
export const CITY_SLUGS = ["dubai", "muscat", "doha"] as const;
export type CitySlug = (typeof CITY_SLUGS)[number];
export type CategorySlug = "creative" | "lifestyle";
export type ListingStatus = "draft" | "submitted" | "under_review" | "approved" | "rejected" | "published" | "archived";
export type VerificationStatus = "unverified" | "pending" | "verified" | "revoked";
export type ReportStatus = "open" | "reviewing" | "resolved" | "dismissed";

export interface City {
  readonly id: string; readonly slug: CitySlug; readonly name: string;
  readonly countryCode: "AE" | "OM" | "QA"; readonly locale: string;
  readonly currencyCode: "AED" | "OMR" | "QAR"; readonly enabled: boolean;
}
export interface Category { readonly id: string; readonly slug: CategorySlug; readonly label: string; readonly parentId?: string; readonly enabled: boolean; }
export interface Listing {
  readonly id: string; readonly cityId: string; readonly categoryId: string;
  readonly slug: string; readonly title: string; readonly description: string;
  readonly status: ListingStatus; readonly verificationStatus: VerificationStatus;
  readonly sponsoredExample: boolean; readonly createdAt: string; readonly updatedAt: string;
  readonly revision: number;
}
export interface ListingMedia {
  readonly id: string; readonly listingId: string; readonly assetRef: string;
  readonly rightsStatus: "unknown" | "cleared" | "rejected"; readonly sortOrder: number;
}
export interface Submission {
  readonly id: string; readonly listingId: string; readonly actorRef: string;
  readonly status: "submitted" | "in_review" | "decided"; readonly submittedAt: string;
}
export interface ModerationDecision {
  readonly id: string; readonly submissionId: string; readonly actorRef: string;
  readonly outcome: "approved" | "rejected"; readonly reasonCode: string; readonly occurredAt: string;
}
export interface Report {
  readonly id: string; readonly listingId: string; readonly reasonCode: string;
  readonly status: ReportStatus; readonly createdAt: string;
}
export interface AuditEvent {
  readonly id: string; readonly actorRef: string; readonly action: string;
  readonly targetType: string; readonly targetId: string; readonly occurredAt: string;
}
// Future schema only; no ad serving, campaign execution or billing.
export interface AdPlacement { readonly id: string; readonly cityId: string; readonly slot: string; readonly enabled: false; }
export interface Campaign { readonly id: string; readonly placementId: string; readonly reviewStatus: "draft" | "pending"; readonly enabled: false; }

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const ISO_UTC = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{3})?Z$/;
const STATES: readonly ListingStatus[] = ["draft","submitted","under_review","approved","rejected","published","archived"];
const VERIFICATIONS: readonly VerificationStatus[] = ["unverified","pending","verified","revoked"];
const transitions: Readonly<Record<ListingStatus, readonly ListingStatus[]>> = {
  draft: ["submitted","archived"],
  submitted: ["under_review","archived"],
  under_review: ["approved","rejected"],
  approved: ["published","archived"],
  rejected: ["draft","archived"],
  published: ["archived"],
  archived: [],
};
export class DomainError extends Error {
  constructor(readonly code: "INVALID" | "CONFLICT" | "NOT_FOUND" | "ILLEGAL_TRANSITION", message: string) {
    super(message); this.name = "DomainError";
  }
}
function invariant(value: unknown, message: string): asserts value {
  if (!value) throw new DomainError("INVALID", message);
}
function id(value: unknown): value is string { return typeof value === "string" && SLUG.test(value); }
function timestamp(value: unknown): value is string {
  return typeof value === "string" && ISO_UTC.test(value) && !Number.isNaN(Date.parse(value)) && new Date(value).toISOString() ===
    (value.includes(".") ? value : value.replace("Z",".000Z"));
}
export function asCitySlug(input: unknown): CitySlug {
  if (typeof input !== "string" || !(CITY_SLUGS as readonly string[]).includes(input))
    throw new DomainError("INVALID", "Unknown city");
  return input as CitySlug;
}
export function validateCity(value: City): City {
  invariant(id(value.id) && asCitySlug(value.slug) && value.name.trim().length > 0, "Invalid city");
  const country = {dubai:"AE",muscat:"OM",doha:"QA"} as const;
  const currency = {dubai:"AED",muscat:"OMR",doha:"QAR"} as const;
  invariant(value.countryCode === country[value.slug] && value.currencyCode === currency[value.slug] &&
    typeof value.locale === "string" && value.locale.length > 1 && typeof value.enabled === "boolean", "Invalid city configuration");
  return value;
}
export function validateCategory(value: Category): Category {
  invariant(id(value.id) && id(value.slug) && ["creative","lifestyle"].includes(value.slug) &&
    value.label.trim().length > 0 && typeof value.enabled === "boolean" &&
    (!value.parentId || id(value.parentId)), "Invalid category");
  return value;
}
export function validateListing(value: Listing): Listing {
  invariant(id(value.id) && id(value.cityId) && id(value.categoryId) && id(value.slug) &&
    value.title.trim().length > 0 && value.description.trim().length > 0 &&
    STATES.includes(value.status) && VERIFICATIONS.includes(value.verificationStatus) &&
    typeof value.sponsoredExample === "boolean" && timestamp(value.createdAt) && timestamp(value.updatedAt) &&
    Date.parse(value.updatedAt) >= Date.parse(value.createdAt) &&
    Number.isSafeInteger(value.revision) && value.revision >= 0, "Invalid listing");
  return value;
}
export function assertTransition(from: ListingStatus, to: ListingStatus): void {
  if (from === to) return; // idempotent retry; no new audit event
  if (!transitions[from]?.includes(to)) throw new DomainError("ILLEGAL_TRANSITION", `Cannot transition ${from} to ${to}`);
}
export function validateIntegrity(input: {
  cities: readonly City[]; categories: readonly Category[]; listings: readonly Listing[];
  media?: readonly ListingMedia[]; submissions?: readonly Submission[];
  decisions?: readonly ModerationDecision[]; reports?: readonly Report[];
  audits?: readonly AuditEvent[];
}): void {
  const unique = (keys: readonly string[], label: string) => {
    if (new Set(keys).size !== keys.length) throw new DomainError("CONFLICT", `Duplicate ${label}`);
  };
  input.cities.forEach(validateCity); input.categories.forEach(validateCategory); input.listings.forEach(validateListing);
  unique(input.cities.map(x=>x.id),"city id"); unique(input.cities.map(x=>x.slug),"city slug");
  unique(input.categories.map(x=>x.id),"category id"); unique(input.categories.map(x=>x.slug),"category slug");
  unique(input.listings.map(x=>x.id),"listing id");
  unique(input.listings.map(x=>`${x.cityId}/${x.slug}`),"city-scoped listing slug");
  const cityIds = new Set(input.cities.map(x=>x.id)); const catIds = new Set(input.categories.map(x=>x.id));
  for (const item of input.listings) invariant(cityIds.has(item.cityId) && catIds.has(item.categoryId), "Unresolved listing relation");
  for (const category of input.categories) invariant(!category.parentId || (catIds.has(category.parentId) && category.id !== category.parentId), "Invalid category parent");
  const listingIds = new Set(input.listings.map(x=>x.id));
  const submissions = input.submissions ?? []; const submissionIds = new Set(submissions.map(x=>x.id));
  unique(submissions.map(x=>x.id),"submission id");
  for (const x of submissions) invariant(id(x.id) && id(x.listingId) && listingIds.has(x.listingId) && id(x.actorRef) && timestamp(x.submittedAt) && ["submitted","in_review","decided"].includes(x.status), "Invalid submission");
  for (const x of input.media ?? []) invariant(id(x.id) && listingIds.has(x.listingId) && x.assetRef.length>0 && ["unknown","cleared","rejected"].includes(x.rightsStatus) && Number.isSafeInteger(x.sortOrder) && x.sortOrder>=0,"Invalid media");
  for (const x of input.decisions ?? []) invariant(id(x.id) && submissionIds.has(x.submissionId) && id(x.actorRef) && ["approved","rejected"].includes(x.outcome) && x.reasonCode.length>0 && timestamp(x.occurredAt), "Invalid decision");
  for (const x of input.reports ?? []) invariant(id(x.id) && listingIds.has(x.listingId) && x.reasonCode.length>0 && ["open","reviewing","resolved","dismissed"].includes(x.status) && timestamp(x.createdAt), "Invalid report");
  for (const x of input.audits ?? []) invariant(id(x.id) && id(x.actorRef) && x.action.length>0 && x.targetType.length>0 && x.targetId.length>0 && timestamp(x.occurredAt), "Invalid audit event");
  for (const [name, records] of [["media",input.media],["decisions",input.decisions],["reports",input.reports],["audits",input.audits]] as const)
    unique((records ?? []).map(x=>x.id),`${name} id`);
}
