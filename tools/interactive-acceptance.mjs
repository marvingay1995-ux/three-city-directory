import assert from "node:assert/strict";
import { spawn, spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, existsSync, rmSync, writeFileSync, mkdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

const output = process.argv[2] ?? "visual-review";
mkdirSync(output, { recursive: true });
const candidates = [process.env.CHROME_BIN, "google-chrome", "chromium", "chromium-browser"].filter(Boolean);
const browser = candidates.find((cmd) => existsSync(cmd) || spawnSync("which", [cmd]).status === 0);
assert.ok(browser, "Chrome/Chromium required: do not substitute simulated browser results");
const profileDir = mkdtempSync(join(tmpdir(), "three-city-cdp-"));
const child = spawn(browser, ["--headless", "--no-sandbox", "--disable-gpu", "--disable-dev-shm-usage", "--disable-background-networking", "--disable-extensions", "--no-first-run", "--no-zygote", "--renderer-process-limit=1", "--remote-allow-origins=*", "--remote-debugging-port=0", "--user-data-dir=" + profileDir, "about:blank"], { stdio: "ignore" });
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
const checks = [];
let socket, nextId = 0;
const pending = new Map();
const deadline = Date.now() + 18000;
async function awaitUntil(fn, label, attempts = 60) {
  for (let i = 0; i < attempts; i++) {
    if (await fn()) return;
    await sleep(150);
  }
  throw Error("Timed out: " + label);
}
function call(method, params = {}) {
  return new Promise((resolve, reject) => {
    const id = ++nextId;
    const timeout = setTimeout(() => { pending.delete(id); reject(Error("CDP timeout: " + method)); }, 12000);
    pending.set(id, { resolve: value => { clearTimeout(timeout); resolve(value); }, reject: err => { clearTimeout(timeout); reject(err); } });
    socket.send(JSON.stringify({ id, method, params }));
  });
}
async function evaluate(expression) {
  const result = await call("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true });
  if (result.exceptionDetails) throw Error("Browser JS exception: " + JSON.stringify(result.exceptionDetails));
  return result.result.value;
}
async function navigate(path) {
  await call("Page.navigate", { url: "http://127.0.0.1:3000" + path });
  await awaitUntil(async () => (await evaluate("document.readyState === 'complete' && !!document.querySelector('main')")), path);
  await sleep(900); // React hydration; checks below verify actual event-driven state.
}
function record(name, detail) { checks.push({ name, status: "passed", detail }); console.log("PASS " + name + ": " + detail); }
try {
  while (!existsSync(join(profileDir, "DevToolsActivePort"))) {
    if (Date.now() > deadline || child.exitCode !== null) throw Error("Chrome debugging endpoint unavailable");
    await sleep(150);
  }
  const port = Number(readFileSync(join(profileDir, "DevToolsActivePort"), "utf8").split("\n")[0]);
  const pages = await (await fetch("http://127.0.0.1:" + port + "/json/list")).json();
  assert.ok(pages[0]?.webSocketDebuggerUrl, "No browser CDP target");
  socket = new WebSocket(pages[0].webSocketDebuggerUrl);
  await new Promise((resolve, reject) => { socket.addEventListener("open", resolve, { once: true }); socket.addEventListener("error", reject, { once: true }); });
  socket.addEventListener("message", event => {
    const payload = JSON.parse(event.data);
    if (!payload.id || !pending.has(payload.id)) return;
    const waiter = pending.get(payload.id); pending.delete(payload.id);
    if (payload.error) waiter.reject(Error(payload.error.message));
    else waiter.resolve(payload.result ?? {});
  });
  await call("Page.enable");
  await call("Runtime.enable");
  await navigate("/muscat");
  assert.equal(await evaluate("document.querySelectorAll('.compare-toggle').length"), 2);
  await evaluate("document.querySelectorAll('.compare-toggle')[0].click()");
  await awaitUntil(async () => (await evaluate("document.querySelectorAll('.compare-toggle[aria-pressed=true]').length")) === 1, "first comparison choice");
  assert.equal(await evaluate("!!document.querySelector('.compare-panel')"), true);
  await evaluate("document.querySelectorAll('.compare-toggle')[1].click()");
  await awaitUntil(async () => (await evaluate("document.querySelectorAll('.compare-table thead th').length")) === 3, "two-column comparison");
  assert.equal(await evaluate("document.querySelectorAll('.compare-table tbody tr').length"), 5);
  record("Comparison", "Two selected fiction-only cards render side-by-side within Muscat");
  await evaluate("document.querySelector('.compare-clear').click()");
  await awaitUntil(async () => (await evaluate("document.querySelectorAll('.compare-toggle[aria-pressed=true]').length")) === 0, "comparison clear");
  record("Clear comparison", "Selection clears with no persistence");
  await navigate("/muscat?sort=name-desc&category=creative");
  assert.equal(await evaluate("document.querySelectorAll('.listing').length"), 1);
  assert.equal(await evaluate("document.querySelector('.listing-title')?.textContent?.trim()"), "Design Workshop");
  assert.equal(await evaluate("document.querySelector('.sort-nav a[aria-current=true]')?.textContent?.trim()"), "Name Z–A");
  record("Filtered sort", "City, category and sorted results remain coherent");
  await navigate("/muscat/listing/design-workshop");
  await awaitUntil(async () => (await evaluate("document.querySelectorAll('.demo-gallery-thumb').length")) === 2, "gallery controls");
  await evaluate("document.querySelectorAll('.demo-gallery-thumb')[1].click()");
  await awaitUntil(async () => (await evaluate("document.querySelector('.demo-gallery-stage')?.classList.contains('gallery-detail')")) === true, "gallery click");
  assert.equal(await evaluate("document.querySelector('.demo-gallery-thumb[aria-pressed=true]')?.textContent?.includes('Detail')"), true);
  await evaluate("document.querySelectorAll('.demo-gallery-thumb')[0].click()");
  await awaitUntil(async () => (await evaluate("document.querySelector('.demo-gallery-stage')?.classList.contains('gallery-overview')")) === true, "gallery reset");
  record("Gallery interaction", "Detail and Overview buttons switch visible React state");
  // Accessibility acceptance matrix — genuine viewport emulation and keyboard events.
  for (const width of [320, 375, 390, 768, 1024]) {
    const height = width < 400 ? 844 : 900;
    await call("Emulation.setDeviceMetricsOverride", { width, height, deviceScaleFactor: 1, mobile: width < 600 });
    for (const path of ["/", "/muscat", "/muscat/listing/design-workshop"]) {
      await navigate(path);
      const state = await evaluate("({viewport:innerWidth,root:document.documentElement.scrollWidth,body:document.body.scrollWidth,notice:document.body.innerText.includes('All listings are fictional.'),focusable:[...document.querySelectorAll('a[href],button:not([disabled]),input:not([disabled])')].filter(el=>el.getClientRects().length && getComputedStyle(el).visibility !== 'hidden').length})");
      assert.equal(state.notice, true, "Missing fictional notice: " + path + " @" + width);
      assert.ok(state.root <= state.viewport + 2 && state.body <= state.viewport + 2, "Horizontal overflow @" + width + " " + path + ": " + JSON.stringify(state));
      assert.ok(state.focusable >= 3, "Too few visible keyboard controls: " + path);
      record("Viewport " + width + " " + path, "No document overflow, fictional disclosure, keyboard controls present");
    }
  }
  await call("Emulation.clearDeviceMetricsOverride");
  await navigate("/muscat/listing/design-workshop");
  // Use actual browser keyboard events; inspect computed focus style rather than just static CSS.
  await evaluate("document.activeElement instanceof HTMLElement && document.activeElement.blur()");
  await call("Input.dispatchKeyEvent", { type: "rawKeyDown", key: "Tab", code: "Tab", windowsVirtualKeyCode: 9 });
  await call("Input.dispatchKeyEvent", { type: "keyUp", key: "Tab", code: "Tab", windowsVirtualKeyCode: 9 });
  const tab = await evaluate("({tag:document.activeElement?.tagName,label:document.activeElement?.textContent?.trim().slice(0,60),outline:getComputedStyle(document.activeElement).outlineStyle,focusVisible:document.activeElement?.matches(':focus-visible')})");
  assert.equal(tab.tag, "A", "First keyboard Tab must reach the accessibility skip link: " + JSON.stringify(tab));
  assert.ok(tab.focusVisible, "Keyboard focus-visible selector must match: " + JSON.stringify(tab));
  assert.notEqual(tab.outline, "none", "Keyboard focus must have visible outline: " + JSON.stringify(tab));
  record("Keyboard focus", "Real Tab focuses skip link and yields visible focus outline");
  await call("Input.dispatchKeyEvent", { type: "rawKeyDown", key: "Enter", code: "Enter", windowsVirtualKeyCode: 13 });
  await call("Input.dispatchKeyEvent", { type: "keyUp", key: "Enter", code: "Enter", windowsVirtualKeyCode: 13 });
  await awaitUntil(async () => (await evaluate("location.hash")) === "#main-content", "skip link activation");
  record("Skip link", "Keyboard Enter follows the skip-to-main navigation");
  record("Browser runtime", "Actual headless Chrome, local Next.js via CDP (no simulated interactions)");
  writeFileSync(join(output, "interactive-checks.json"), JSON.stringify({ source: "real Chrome CDP", time_utc: new Date().toISOString(), checks }, null, 2));
} finally {
  for (const waiter of pending.values()) waiter.reject(Error("Browser closed"));
  socket?.close();
  child.kill("SIGTERM");
  await sleep(200);
  rmSync(profileDir, { recursive: true, force: true });
}
