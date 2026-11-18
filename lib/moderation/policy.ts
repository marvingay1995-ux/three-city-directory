import { CITY_SLUGS, type CitySlug } from "../domain/model.ts";

export type MockRole = "visitor" | "business_owner" | "moderator" | "administrator";
export type ModerationAction = "submit" | "start_review" | "approve" | "reject" | "reconsider" | "publish";
type Permission = ModerationAction | "view_queue";

type MockActor = {
  readonly ref: string;
  readonly role: MockRole;
  readonly cities: readonly CitySlug[];
};

// Fixed test identities. A caller can select one in the prototype, so this is not authentication.
const actors: readonly MockActor[] = [
  { ref: "visitor-demo", role: "visitor", cities: [] },
  { ref: "owner-dubai", role: "business_owner", cities: ["dubai"] },
  { ref: "owner-muscat", role: "business_owner", cities: ["muscat"] },
  { ref: "owner-doha", role: "business_owner", cities: ["doha"] },
  { ref: "moderator-dubai", role: "moderator", cities: ["dubai"] },
  { ref: "moderator-muscat", role: "moderator", cities: ["muscat"] },
  { ref: "moderator-doha", role: "moderator", cities: ["doha"] },
  { ref: "administrator-demo", role: "administrator", cities: ["dubai", "doha"] },
];

const permissions: Readonly<Record<MockRole, readonly Permission[]>> = {
  visitor: [],
  business_owner: ["submit"],
  moderator: ["view_queue", "start_review", "approve", "reject"],
  administrator: ["view_queue", "reconsider", "publish"],
};

export function isMockCity(city: unknown): city is CitySlug {
  return CITY_SLUGS.some((slug) => slug === city);
}

export function permitsMockAction(actorRef: unknown, city: unknown, action: unknown, ownerRef?: string): boolean {
  if (!isMockCity(city)) return false;
  const actor = actors.find(({ ref }) => ref === actorRef);
  if (!actor || !actor.cities.includes(city)) return false;
  if (!permissions[actor.role].some((permission) => permission === action)) return false;
  return actor.role !== "business_owner" || actor.ref === ownerRef;
}
