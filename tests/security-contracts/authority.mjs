// Synthetic authority only. No credential, token, session cookie, clock or I/O.
export const cities = Object.freeze(["dubai", "muscat", "doha"]);
const roles = ["visitor", "owner", "moderator", "verifier", "administrator", "auditor"];
const permissions = {
  visitor: [], owner: ["submit", "withdraw"], moderator: ["start_review", "approve", "reject"],
  verifier: ["verify"], administrator: ["publish", "transfer"], auditor: ["read_audit"],
};
const principal = (city, suffix) => `${city}-${suffix}`;

export function createFixtureAuthority() {
  const records = new Map();
  for (const city of cities) {
    for (const role of roles) {
      records.set(principal(city, role), { city, role, grant: 1, session: 1, active: true, expiry: 100 });
    }
    records.set(principal(city, "alternate"), { city, role: "owner", grant: 1, session: 1, active: true, expiry: 100 });
  }

  const contexts = new WeakMap();
  let policy = 1;
  let tick = 0;

  function context(id) {
    const record = records.get(id);
    if (!record) return undefined;
    const handle = Object.freeze({});
    contexts.set(handle, { id, grant: record.grant, session: record.session, policy });
    return handle;
  }

  function authorized(handle, city, action, resource) {
    const claim = contexts.get(handle);
    const record = claim && records.get(claim.id);
    if (!record?.active || tick >= record.expiry || claim.policy !== policy ||
        claim.grant !== record.grant || claim.session !== record.session ||
        record.city !== city || !permissions[record.role].includes(action)) return undefined;
    if (action === "read_audit") return claim.id;
    if (!resource || resource.city !== city) return undefined;
    if (record.role === "owner" && resource.owner !== claim.id) return undefined;
    if (["start_review", "approve", "reject", "verify", "publish"].includes(action) &&
        [resource.owner, resource.submittedBy].includes(claim.id)) return undefined;
    if (action === "verify" && [resource.reviewer, resource.approvedBy].includes(claim.id)) return undefined;
    if (action === "publish" && [resource.reviewer, resource.approvedBy, resource.verifiedBy].includes(claim.id)) return undefined;
    return claim.id;
  }

  // Test-only knobs represent updates from a separate authoritative fixture store.
  function fixtureUpdate(id, apply) {
    const current = records.get(id);
    if (!current) throw new Error("Unknown fixture principal");
    records.set(id, apply(current));
  }
  return Object.freeze({
    context, authorized,
    eligibleOwner: (id, city) => {
      const record = records.get(id);
      return record?.active && record.city === city && record.role === "owner" && tick < record.expiry;
    },
    revoke: (id) => fixtureUpdate(id, (record) => ({ ...record, active: false, grant: record.grant + 1 })),
    rotateSession: (id) => fixtureUpdate(id, (record) => ({ ...record, session: record.session + 1 })),
    setRole: (id, role) => {
      if (!roles.includes(role)) throw new Error("Unknown fixture role");
      fixtureUpdate(id, (record) => ({ ...record, role, grant: record.grant + 1 }));
    },
    bumpPolicy: () => { policy++; },
    expire: () => { tick = 100; },
  });
}
