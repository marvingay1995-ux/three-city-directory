const levels = ["info", "low", "moderate", "high", "critical"];
const isRecord = (value) => value !== null && typeof value === "object" && !Array.isArray(value);
const isCount = (value) => Number.isSafeInteger(value) && value >= 0;

export function evaluateAudit(execution, report) {
  const exitCode = execution?.exitCode;
  const error = (reason) => ({ status: "error", reason, auditExitCode: Number.isInteger(exitCode) ? exitCode : null });

  if (!isRecord(execution) || execution.collectionFailed) return error("execution-unavailable");
  if (execution.toolFailure !== false || execution.signal !== null || !Number.isInteger(exitCode)) return error("tool-failure");
  if (!isRecord(report)) return error("invalid-report");
  if (Object.hasOwn(report, "error")) return error("registry-or-tool-error");
  if (exitCode !== 0 && exitCode !== 1) return error("unexpected-exit");
  if (report.auditReportVersion !== 2 || !isRecord(report.vulnerabilities)) return error("unsupported-schema");

  const counts = report.metadata?.vulnerabilities;
  if (!isRecord(counts) || ![...levels, "total"].every((level) => isCount(counts[level]))) {
    return error("invalid-counts");
  }
  const observed = Object.fromEntries(levels.map((level) => [level, 0]));
  const packages = new Map(Object.entries(report.vulnerabilities));
  const advisoryBySource = new Map();
  const parents = new Map();
  const anchored = new Set();

  for (const [name, item] of packages) {
    if (!isRecord(item) || item.name !== name || !levels.includes(item.severity) ||
        !Array.isArray(item.via) || item.via.length === 0) return error("invalid-vulnerability");
    observed[item.severity]++;
    for (const cause of item.via) {
      if (typeof cause === "string") {
        if (!packages.has(cause)) return error("invalid-advisory-chain");
        if (!parents.has(cause)) parents.set(cause, []);
        parents.get(cause).push(name);
        continue;
      }
      if (!isRecord(cause) || !isCount(cause.source) || cause.source === 0 ||
          typeof cause.url !== "string" || !levels.includes(cause.severity) ||
          levels.indexOf(cause.severity) > levels.indexOf(item.severity)) return error("invalid-advisory");

      let url;
      try {
        url = new URL(cause.url);
      } catch {
        return error("invalid-advisory");
      }
      if (url.protocol !== "https:" || url.username || url.password) return error("invalid-advisory");
      const id = url.pathname.match(/\b(?:GHSA-[a-z0-9]{4}-[a-z0-9]{4}-[a-z0-9]{4}|CVE-\d{4}-\d{4,})\b/i)?.[0]
        ?? `npm:${cause.source}`;
      const advisory = { id, source: cause.source, severity: cause.severity };
      const prior = advisoryBySource.get(cause.source);
      if (prior && (prior.id !== id || prior.severity !== cause.severity)) return error("contradictory-advisory");
      advisoryBySource.set(cause.source, advisory);
      anchored.add(name);
    }
  }

  // Follow reverse dependency links once to require a real advisory behind every package entry.
  for (const name of anchored) {
    for (const parent of parents.get(name) ?? []) anchored.add(parent);
  }
  if (anchored.size !== packages.size) return error("invalid-advisory-chain");
  if (counts.total !== packages.size || levels.some((level) => counts[level] !== observed[level])) {
    return error("contradictory-counts");
  }
  if (exitCode !== (counts.total ? 1 : 0)) return error("contradictory-exit");

  const status = counts.high || counts.critical ? "blocked" : counts.total ? "warning" : "clean";
  return {
    status, auditExitCode: exitCode,
    counts: { ...observed, total: packages.size },
    advisories: [...advisoryBySource.values()].sort((a, b) => a.source - b.source),
    ...(status === "warning" ? { triageOwner: "Release Engineering" } : {}),
  };
}
