import assert from "node:assert/strict";
import { spawn, spawnSync } from "node:child_process";
import { existsSync, mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { createHash } from "node:crypto";

const output = process.argv[2] ?? "visual-review";
mkdirSync(output, { recursive: true });
const browsers = [process.env.CHROME_BIN, "google-chrome", "chromium", "chromium-browser"].filter(Boolean);
const browser = browsers.find(cmd => existsSync(cmd) || spawnSync("which", [cmd]).status === 0);
assert.ok(browser, "A real Chrome or Chromium executable is required");
const checks = [
  ["full-home-desktop", "/", 1440],
  ["full-home-mobile", "/", 390],
  ["full-dubai-directory-mobile", "/dubai", 390],
  ["full-muscat-directory-mobile", "/muscat", 390],
  ["full-doha-directory-mobile", "/doha", 390],
  ["full-muscat-profile-mobile", "/muscat/listing/design-workshop", 390],
  ["full-muscat-zero-results", "/muscat?q=not-a-fixture-name&category=creative", 390],
];
const profileDir = mkdtempSync(join(tmpdir(), "three-city-fullpage-"));
const chrome = spawn(browser, [
  "--headless", "--no-sandbox", "--disable-gpu", "--disable-dev-shm-usage",
  "--disable-background-networking", "--disable-extensions", "--no-first-run",
  "--no-zygote", "--remote-allow-origins=*", "--remote-debugging-port=0",
  "--user-data-dir=" + profileDir, "about:blank",
], { stdio: "ignore" });
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
const pending = new Map();
let socket, nextId = 0;
function call(method, params = {}) {
  return new Promise((resolve, reject) => {
    const id = ++nextId;
    const timeout = setTimeout(() => { pending.delete(id); reject(Error("CDP timeout: " + method)); }, 15000);
    pending.set(id, {
      resolve: result => { clearTimeout(timeout); resolve(result); },
      reject: err => { clearTimeout(timeout); reject(err); },
    });
    socket.send(JSON.stringify({ id, method, params }));
  });
}
async function evaluate(expression) {
  const result = await call("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true });
  if (result.exceptionDetails) throw Error("Browser runtime exception: " + JSON.stringify(result.exceptionDetails));
  return result.result.value;
}
async function awaitUntil(predicate, label) {
  for (let attempt = 0; attempt < 60; attempt++) {
    if (await predicate()) return;
    await sleep(150);
  }
  throw Error("Timed out: " + label);
}
const captures = [];
const escape = value => String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
try {
  const until = Date.now() + 20000;
  while (!existsSync(join(profileDir, "DevToolsActivePort"))) {
    if (Date.now() > until || chrome.exitCode !== null) throw Error("Chrome CDP endpoint missing");
    await sleep(150);
  }
  const port = Number(readFileSync(join(profileDir, "DevToolsActivePort"), "utf8").split("\n")[0]);
  const targets = await (await fetch("http://127.0.0.1:" + port + "/json/list")).json();
  assert.ok(targets[0]?.webSocketDebuggerUrl);
  socket = new WebSocket(targets[0].webSocketDebuggerUrl);
  await new Promise((resolve, reject) => {
    socket.addEventListener("open", resolve, { once: true });
    socket.addEventListener("error", reject, { once: true });
  });
  socket.addEventListener("message", event => {
    const packet = JSON.parse(event.data);
    if (!packet.id || !pending.has(packet.id)) return;
    const callback = pending.get(packet.id);
    pending.delete(packet.id);
    packet.error ? callback.reject(Error(packet.error.message)) : callback.resolve(packet.result ?? {});
  });
  await call("Page.enable");
  await call("Runtime.enable");
  for (const [name, path, width] of checks) {
    await call("Emulation.setDeviceMetricsOverride", { width, height: 900, deviceScaleFactor: 1, mobile: width < 600 });
    await call("Page.navigate", { url: "http://127.0.0.1:3000" + path });
    await awaitUntil(async () => await evaluate("document.readyState === 'complete' && !!document.querySelector('main')"), name);
    await sleep(750);
    const initial = await evaluate("({fictional:document.body.innerText.includes('All listings are fictional.'), height:Math.max(document.documentElement.scrollHeight,document.body.scrollHeight), width:document.documentElement.scrollWidth, viewport:innerWidth, noindex:!!document.querySelector('meta[name=robots][content*=noindex]')})");
    assert.ok(initial.fictional && initial.noindex, "Missing demo/noindex state: " + name);
    assert.ok(initial.width <= initial.viewport + 2, "Horizontal overflow: " + name + " " + JSON.stringify(initial));
    assert.ok(initial.height > 0 && initial.height <= 12000, "Unexpected document height: " + name + " " + initial.height);
    // Reveal lazy-loaded page content before measuring final height. No external media is used.
    await evaluate("window.scrollTo(0,document.documentElement.scrollHeight)");
    await sleep(180);
    await evaluate("window.scrollTo(0,0)");
    const metrics = await call("Page.getLayoutMetrics");
    const widthPixels = Math.ceil(metrics.cssContentSize?.width ?? initial.viewport);
    const heightPixels = Math.ceil(metrics.cssContentSize?.height ?? initial.height);
    assert.ok(heightPixels > 0 && heightPixels <= 12000);
    assert.ok(widthPixels <= width + 2, "Content width overflow at " + name);
    const data = await call("Page.captureScreenshot", {
      format: "png", captureBeyondViewport: true, fromSurface: true,
      clip: { x: 0, y: 0, width: widthPixels, height: heightPixels, scale: 1 },
    });
    const bytes = Buffer.from(data.data, "base64");
    assert.equal(bytes.subarray(0,8).toString("hex"), "89504e470d0a1a0a");
    const file = name + ".png";
    writeFileSync(join(output, file), bytes);
    captures.push({ name, path, viewport_width: width, full_page_height: heightPixels, file, sha256: createHash("sha256").update(bytes).digest("hex") });
    console.log("Full-page capture: " + name + " " + widthPixels + "x" + heightPixels + " (" + bytes.length + " bytes)");
  }
  const cards = captures.map(c => `<figure><a href="${escape(c.file)}"><img loading="lazy" src="${escape(c.file)}" alt="Full-page local capture: ${escape(c.name)}"></a><figcaption>${escape(c.name)} · ${c.viewport_width}×${c.full_page_height} · <a href="${escape(c.file)}">Open full size</a></figcaption></figure>`).join("\n");
  const page = `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>UX-008 · Full-page private screenshots</title><style>body{background:#101114;color:#f3e9e8;font:16px system-ui;margin:0}main{max-width:1160px;margin:auto;padding:24px}p{color:#d1bfc1;line-height:1.6}a{color:#e9b8b6}a:focus-visible{outline:3px solid #f1d28c}section{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,350px),1fr));gap:20px}figure{margin:0;padding:12px;background:#211d22;border:1px solid #68505d}img{display:block;max-width:100%;height:auto}figcaption{padding:12px 0;font-size:13px}</style><main><h1>UX-008 · Full-page design review</h1><p>Real local Chrome DevTools Protocol captures of seven entire page layouts, not viewport-only screenshots. All listings are fictional. These are not live webpages or human visual approvals. Open each image full size to inspect content below the fold. The separate UX-007 gallery has additional viewport comparisons.</p><section>${cards}</section></main></html>`;
  writeFileSync(join(output, "full-page-index.html"), page);
  writeFileSync(join(output, "full-page-manifest.json"), JSON.stringify({ source: "real Chrome CDP", origin: "loopback only", generated_utc: new Date().toISOString(), captures, limitations: ["Not a human visual approval", "Not a real-device or screen-reader test", "No live hosting"] }, null, 2));
} finally {
  for (const callback of pending.values()) callback.reject(Error("Browser closed"));
  socket?.close();
  chrome.kill("SIGTERM");
  await sleep(150);
  rmSync(profileDir, { recursive: true, force: true });
}
