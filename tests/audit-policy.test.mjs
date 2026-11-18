import assert from "node:assert/strict";
import test from "node:test";
import { spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, readdirSync, rmdirSync, unlinkSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";
import { evaluateAudit } from "../tools/audit-policy.mjs";

const execution = (exitCode, extra = {}) => ({ exitCode, signal: null, toolFailure: false, ...extra });
const levels = ["info", "low", "moderate", "high", "critical"];
function report(...severities) {
  const vulnerabilities = Object.fromEntries(severities.map((severity, index) => {
    const name = `fixture-${index}`;
    return [name, {
      name, severity,
      via: [{ source: index + 1, severity, url: "https://example.invalid/advisory/" + (index + 1) }],
    }];
  }));
  const counts = Object.fromEntries(levels.map((level) => [level, severities.filter((item) => item === level).length]));
  return { auditReportVersion: 2, vulnerabilities, metadata: { vulnerabilities: { ...counts, total: severities.length } } };
}

for (const [severities, status] of [
  [[], "clean"], [["info"], "warning"], [["low"], "warning"], [["moderate"], "warning"],
  [["high"], "blocked"], [["critical"], "blocked"], [["low", "moderate", "critical"], "blocked"],
]) {
  test(`npm audit ${severities.join("+") || "clean"} is ${status}`, () => {
    const result = evaluateAudit(execution(severities.length ? 1 : 0), report(...severities));
    assert.equal(result.status, status);
    assert.equal(result.counts.total, severities.length);
    assert.equal(result.triageOwner, status === "warning" ? "Release Engineering" : undefined);
    assert.deepEqual(result.advisories.map(({ id }) => id), severities.map((_, i) => `npm:${i + 1}`));
  });
}

test("transitive entries retain the real advisory ID and package count", () => {
  const r = report("moderate", "high");
  r.vulnerabilities["fixture-0"].via = ["fixture-1"];
  r.vulnerabilities["fixture-1"].via[0].url = "https://github.com/advisories/GHSA-xxxx-yyyy-zzzz";
  const result = evaluateAudit(execution(1), r);
  assert.equal(result.status, "blocked");
  assert.equal(result.counts.total, 2);
  assert.deepEqual(result.advisories, [{ id: "GHSA-xxxx-yyyy-zzzz", source: 2, severity: "high" }]);
});

test("invalid, contradictory and unavailable audit evidence fails closed", () => {
  const invalidCount = report();
  invalidCount.metadata.vulnerabilities.high = -1;
  const mismatched = report("moderate");
  mismatched.metadata.vulnerabilities.total = 0;
  const missingAdvisoryId = report("moderate");
  delete missingAdvisoryId.vulnerabilities["fixture-0"].via[0].source;
  const orphan = report("moderate");
  orphan.vulnerabilities["fixture-0"].via = ["unlisted"];
  const cycle = report("moderate", "low");
  cycle.vulnerabilities["fixture-0"].via = ["fixture-1"];
  cycle.vulnerabilities["fixture-1"].via = ["fixture-0"];
  for (const [run, input, reason] of [
    [undefined, report(), "execution-unavailable"],
    [execution(null, { toolFailure: true }), report(), "tool-failure"],
    [execution(0, { signal: "SIGTERM" }), report(), "tool-failure"],
    [execution(0), undefined, "invalid-report"],
    [execution(1), { error: { code: "E503" } }, "registry-or-tool-error"],
    [execution(2), report("moderate"), "unexpected-exit"],
    [execution(0), { ...report(), auditReportVersion: 1 }, "unsupported-schema"],
    [execution(0), { ...report(), metadata: {} }, "invalid-counts"],
    [execution(0), invalidCount, "invalid-counts"],
    [execution(1), mismatched, "contradictory-counts"],
    [execution(1), missingAdvisoryId, "invalid-advisory"],
    [execution(1), orphan, "invalid-advisory-chain"],
    [execution(1), cycle, "invalid-advisory-chain"],
    [execution(1), report(), "contradictory-exit"],
    [execution(0), report("moderate"), "contradictory-exit"],
  ]) {
    assert.equal(evaluateAudit(run, input).status, "error", reason);
    assert.equal(evaluateAudit(run, input).reason, reason);
  }
});

const cli = fileURLToPath(new URL("../tools/audit-evidence.mjs", import.meta.url));
function gate(t, { raw, code = 1, outcome = "success", executionRaw } = {}) {
  const folder = mkdtempSync(join(tmpdir(), "sec003-test-"));
  t.after(() => {
    for (const name of readdirSync(folder)) unlinkSync(join(folder, name));
    rmdirSync(folder);
  });
  if (executionRaw !== null) writeFileSync(join(folder, "execution.json"), executionRaw ?? JSON.stringify(execution(code)));
  if (raw !== undefined) writeFileSync(join(folder, "audit.json"), raw);
  const run = spawnSync(process.execPath, [cli, "evaluate", folder, outcome], { encoding: "utf8" });
  const decision = JSON.parse(readFileSync(join(folder, "decision.json"), "utf8"));
  if (raw !== undefined) assert.equal(readFileSync(join(folder, "audit.json"), "utf8"), raw);
  return { run, decision };
}

test("CLI retains exact input and emits warning, blocking and distinct error decisions", (t) => {
  for (const [options, status, reason] of [
    [{ raw: JSON.stringify(report("moderate")) }, "warning", undefined],
    [{ raw: JSON.stringify(report("high")) }, "blocked", undefined],
    [{ raw: JSON.stringify(report("critical")) }, "blocked", undefined],
    [{ raw: '{"error":{"code":"EAI_AGAIN"}}' }, "error", "registry-or-tool-error"],
    [{ raw: '{"auditReportVersion":' }, "error", "report-invalid-json"],
    [{ raw: "Gateway timeout" }, "error", "report-invalid-json"],
    [{ raw: undefined }, "error", "report-missing"],
    [{ executionRaw: null }, "error", "execution-missing"],
    [{ executionRaw: "{" }, "error", "execution-invalid-json"],
    [{ raw: JSON.stringify(report()), code: 0, outcome: "failure" }, "error", "execution-unavailable"],
  ]) {
    const { run, decision } = gate(t, options);
    assert.equal(decision.status, status);
    assert.equal(decision.reason, reason);
    assert.equal(run.status, status === "warning" ? 0 : 1);
    if (status === "warning") assert.match(run.stdout, /Release Engineering triage: npm:1/);
  }
});

test("moderate and audit errors reproduce the original early-stop condition offline", (t) => {
  const workflow = readFileSync(new URL("../.github/workflows/verify.yml", import.meta.url), "utf8");
  const auditStart = workflow.indexOf("Capture fresh npm audit evidence");
  for (const command of ["run: npm test", "run: npm run typecheck", "run: npm run build", "node tests/profile-http.mjs"]) {
    const index = workflow.indexOf(command);
    assert.ok(index >= 0 && index < auditStart, command);
  }
  assert.match(workflow, /name: Enforce audit policy\s+if: \$\{\{ !cancelled\(\) \}\}/);
  assert.match(workflow, /name: Upload security and functional evidence\s+if: \$\{\{ !cancelled\(\) \}\}/);
  for (const raw of [JSON.stringify(report("moderate")), '{"error":{"code":"E503"}}']) {
    const npmExit = 1;
    const triggersOldDefaultSuccessCondition = npmExit === 0;
    assert.equal(triggersOldDefaultSuccessCondition, false);
    const { decision } = gate(t, { raw, code: npmExit });
    assert.equal(decision.status, raw.includes("E503") ? "error" : "warning");
  }
});
