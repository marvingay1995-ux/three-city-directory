import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { evaluateAudit } from "./audit-policy.mjs";

const [mode, folder, option] = process.argv.slice(2);
if (!folder || !["collect", "evaluate"].includes(mode)) {
  console.error("Usage: node tools/audit-evidence.mjs collect|evaluate <folder> [npm CLI path|collection outcome]");
  process.exit(2);
}

mkdirSync(folder, { recursive: true, mode: 0o700 });
const file = (name) => join(folder, name);
const write = (name, data) => writeFileSync(file(name), JSON.stringify(data, null, 2) + "\n", { mode: 0o600 });
const readError = (name, error, auditExitCode) => ({
  status: "error",
  reason: name + (error.code === "ENOENT" ? "-missing" : error instanceof SyntaxError ? "-invalid-json" : "-unreadable"),
  auditExitCode,
});
function read(name) {
  return JSON.parse(readFileSync(file(name), "utf8"));
}

if (mode === "collect") {
  const registry = "https://registry.npmjs.org/";
  const args = ["audit", "--json", "--audit-level=info", "--prefer-online", "--include=dev", "--include=optional", "--include=peer", "--fetch-retries=0", `--registry=${registry}`];
  const invoke = (args) => spawnSync(option ? process.execPath : "npm", option ? [option, ...args] : args, {
    stdio: ["ignore", "pipe", "ignore"], timeout: 120_000, maxBuffer: 8 * 1024 * 1024,
  });
  const lockfileSha256 = createHash("sha256").update(readFileSync("package-lock.json")).digest("hex");
  const npm = invoke(["--version"]);
  const npmVersion = npm.stdout?.toString().trim();
  const versionVerified = npm.status === 0 && !npm.error && /^\d+\.\d+\.\d+$/.test(npmVersion);
  const startedAt = new Date().toISOString();
  const result = invoke(args);
  writeFileSync(file("audit.json"), result.stdout ?? Buffer.alloc(0), { mode: 0o600 });
  write("execution.json", {
    exitCode: result.status, signal: result.signal, toolFailure: Boolean(result.error) || !versionVerified,
    startedAt, finishedAt: new Date().toISOString(), node: process.version, npm: versionVerified ? npmVersion : null,
    registry, args, lockfileSha256, commit: process.env.GITHUB_SHA ?? null,
    runner: {
      name: process.env.RUNNER_NAME ?? null, os: process.env.RUNNER_OS ?? process.platform,
      arch: process.env.RUNNER_ARCH ?? process.arch, image: process.env.ImageOS ?? null,
      imageVersion: process.env.ImageVersion ?? null, runId: process.env.GITHUB_RUN_ID ?? null,
      runAttempt: process.env.GITHUB_RUN_ATTEMPT ?? null,
    },
  });
  console.log("Captured npm audit output and execution metadata; decision deferred to the security gate.");
} else {
  let execution, report, decision;
  try {
    execution = read("execution.json");
  } catch (error) {
    decision = readError("execution", error, null);
  }
  if (!decision) {
    if (option !== "success" || !execution || execution.toolFailure || execution.signal || !Number.isInteger(execution.exitCode)) {
      decision = evaluateAudit(option === "success" ? execution : { collectionFailed: true, exitCode: execution?.exitCode });
    } else {
      try {
        report = read("audit.json");
        decision = evaluateAudit(execution, report);
      } catch (error) {
        decision = readError("report", error, execution.exitCode);
      }
    }
  }
  write("decision.json", decision);
  if (decision.status === "warning") {
    console.log(`::warning::npm audit requires Release Engineering triage: ${decision.advisories.map(({ id }) => id).join(", ")}`);
  }
  console.log(`Audit decision: ${decision.status}; npm exit: ${decision.auditExitCode ?? "unavailable"}${decision.reason ? `; ${decision.reason}` : ""}`);
  process.exitCode = decision.status === "blocked" || decision.status === "error" ? 1 : 0;
}
