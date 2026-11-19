import { cities } from "./authority.mjs";

const transitions = {
  submit: ["draft", "rejected"], start_review: ["submitted"], approve: ["in_review"],
  reject: ["in_review"], verify: ["approved"], publish: ["approved"],
  transfer: ["draft", "submitted", "in_review", "approved", "rejected", "published"],
  withdraw: ["draft", "submitted", "in_review", "approved", "rejected", "published"],
};
const reasons = ["missing-evidence", "outside-policy"];
const id = (value) => typeof value === "string" && /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value) && value.length <= 60;

export function normalizeCommand(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return undefined;
  const { version, city, resourceId, action, expectedRevision, key, payload } = value;
  const fieldsRequired = ["version", "city", "resourceId", "action", "expectedRevision", "key", "payload"];
  if (Object.keys(value).length !== fieldsRequired.length || !fieldsRequired.every((field) => Object.hasOwn(value, field)) || version !== 1 || !cities.includes(city) ||
      !id(resourceId) || typeof action !== "string" || !Object.hasOwn(transitions, action) ||
      !Number.isSafeInteger(expectedRevision) || expectedRevision < 0 || !id(key) ||
      !payload || typeof payload !== "object" || Array.isArray(payload)) return undefined;
  const fields = Object.keys(payload);
  const data = action === "reject" ? payload.reason : action === "transfer" ? payload.owner : null;
  if (action === "reject" ? fields.length !== 1 || fields[0] !== "reason" || !reasons.includes(data)
      : action === "transfer" ? fields.length !== 1 || fields[0] !== "owner" || !id(data)
        : fields.length !== 0) return undefined;
  return Object.freeze({ version, city, resourceId, action, expectedRevision, key, data });
}

export const resourceKey = ({ city, resourceId }) => `${city}/${resourceId}`;
export const receiptScope = (actor, command) => JSON.stringify([actor, command.city, command.resourceId, command.action, command.key]);
export const fingerprint = (actor, command) => JSON.stringify([
  actor, command.version, command.city, command.resourceId, command.action, command.expectedRevision, command.data,
]);

function resetVersion(record) {
  return {
    ...record, verified: false, submittedBy: null, reviewer: null, approvedBy: null, verifiedBy: null, publishedBy: null,
  };
}

export function initialResources() {
  return cities.map((city) => resetVersion({
    city, resourceId: "listing-one", owner: `${city}-owner`, revision: 0, contentVersion: 0, status: "draft",
  }));
}

export function transition(record, command, actor, authority) {
  const { action } = command;
  if (!transitions[action].includes(record.status)) return undefined;
  const updated = { ...record, revision: record.revision + 1 };
  switch (action) {
    case "submit":
      return { ...resetVersion(updated), status: "submitted", submittedBy: actor, contentVersion: record.contentVersion + 1 };
    case "start_review":
      return { ...updated, status: "in_review", reviewer: actor };
    case "approve":
      return record.reviewer === actor ? { ...updated, status: "approved", approvedBy: actor } : undefined;
    case "reject":
      return record.reviewer === actor ? { ...updated, status: "rejected" } : undefined;
    case "verify":
      return !record.verified ? { ...updated, verified: true, verifiedBy: actor } : undefined;
    case "publish":
      return record.verified ? { ...updated, status: "published", publishedBy: actor } : undefined;
    case "transfer":
      return command.data !== record.owner && command.data !== actor && authority.eligibleOwner(command.data, record.city)
        ? { ...resetVersion(updated), status: "draft", owner: command.data } : undefined;
    case "withdraw":
      return { ...resetVersion(updated), status: "withdrawn" };
  }
}
