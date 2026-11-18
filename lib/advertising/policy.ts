import { demoListings, categories, type CitySlug, type CategorySlug } from "../directory.ts";

export const disclosure = "Sponsored — simulation only";
export type Slot = "category-panel" | "directory-panel";
export type AdPlacement = { id: string; city: CitySlug; category?: CategorySlug; slot: Slot };
export type Creative = {
  id: string; city: CitySlug; listingId: string; disclosure: string;
  content: "fictional-profile" | "unclassified" | "outside-scope";
  source: "fixture" | "unresolved" | "third-party";
  rights: "fixture-cleared" | "unresolved" | "denied";
  destination: "offline-reference" | "external";
};
export type PlacementRequest = {
  city: unknown; category?: unknown; placementId: unknown; slot: unknown; listingId: unknown;
  startsAt: unknown; endsAt: unknown;
};
const inventory: readonly AdPlacement[] = [
  { id: "dubai-creative", city: "dubai", category: "creative", slot: "category-panel" },
  { id: "muscat-lifestyle", city: "muscat", category: "lifestyle", slot: "category-panel" },
  { id: "doha-directory", city: "doha", slot: "directory-panel" },
];

export function knownCity(city: unknown): city is CitySlug {
  return inventory.some((item) => item.city === city);
}

export function listPlacements(city: unknown): readonly AdPlacement[] {
  return inventory.filter((item) => item.city === city).map((item) => ({ ...item }));
}

export function validTime(value: unknown): value is string {
  return typeof value === "string" && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(value) &&
    Number.isFinite(Date.parse(value)) && new Date(value).toISOString() === value;
}

export function placementIssue(request: PlacementRequest, at: unknown) {
  if (!request || typeof request !== "object") return "invalid-placement";
  if (!knownCity(request.city)) return "unknown-city";
  const category = categories.find(({ slug }) => slug === request.category);
  if (request.category !== undefined && !category) return "unknown-category";
  if (request.slot !== "directory-panel" && request.slot !== "category-panel") return "unknown-slot";
  const placement = inventory.find(({ id }) => id === request.placementId);
  if (!placement) return "unknown-placement";
  if (placement.city !== request.city) return "placement-city-mismatch";
  if (placement.slot !== request.slot) return "slot-mismatch";
  const listing = demoListings.find(({ id }) => id === request.listingId);
  if (!listing) return "unknown-listing";
  if (listing.city !== request.city) return "listing-city-mismatch";
  if ((placement.category && placement.category !== category?.slug) || (category && listing.category !== category.label)) {
    return "category-mismatch";
  }
  if (!validTime(request.startsAt) || !validTime(request.endsAt) || request.startsAt >= request.endsAt) return "invalid-window";
  if (!validTime(at)) return "invalid-time";
  if (at >= request.endsAt) return "expired-window";
}

export function reviewCreative(request: PlacementRequest, creative: Creative, at: unknown) {
  const issue = placementIssue(request, at);
  if (issue) return { status: "rejected", reason: issue } as const;
  if (!creative || typeof creative !== "object" || typeof creative.id !== "string" || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(creative.id)) {
    return { status: "rejected", reason: "invalid-creative" } as const;
  }
  if (creative.city !== request.city || creative.listingId !== request.listingId) return { status: "rejected", reason: "creative-scope-mismatch" } as const;
  if (creative.disclosure !== disclosure) return { status: "rejected", reason: "missing-disclosure" } as const;
  if (creative.destination !== "offline-reference") return { status: "rejected", reason: "disallowed-destination" } as const;
  if (creative.content !== "fictional-profile" && creative.content !== "unclassified") return { status: "rejected", reason: "disallowed-content" } as const;
  if (creative.source !== "fixture" && creative.source !== "unresolved") return { status: "rejected", reason: "disallowed-source" } as const;
  if (creative.rights !== "fixture-cleared" && creative.rights !== "unresolved") return { status: "rejected", reason: "denied-rights" } as const;
  if (creative.content === "unclassified") return { status: "blocked", reason: "manual-policy-review" } as const;
  if (creative.source === "unresolved") return { status: "blocked", reason: "unresolved-source" } as const;
  if (creative.rights === "unresolved") return { status: "blocked", reason: "unresolved-rights" } as const;
  return { status: "approved", reason: "fixture-policy-passed" } as const;
}
export type ReviewDecision = ReturnType<typeof reviewCreative>;
