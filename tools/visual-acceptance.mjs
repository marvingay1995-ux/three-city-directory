import { spawnSync } from "node:child_process";
import { mkdirSync, writeFileSync, readFileSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";
import { join } from "node:path";

const origin = "http://127.0.0.1:3000";
const out = process.argv[2] ?? "visual-review";
mkdirSync(out, { recursive: true });
const browsers = [process.env.CHROME_BIN, "google-chrome", "chromium", "chromium-browser"].filter(Boolean);
const browser = browsers.find((cmd) => spawnSync("which", [cmd], { encoding: "utf8" }).status === 0 || existsSync(cmd));
if (!browser) {
  throw new Error("Visual capture blocked: no Chrome/Chromium executable installed. Do not substitute mock screenshots.");
}
const views = [
  ["home-desktop", "/", 1440, 900],
  ["home-mobile", "/", 390, 844],
  ["muscat-directory-desktop", "/muscat", 1440, 900],
  ["muscat-directory-mobile", "/muscat", 390, 844],
  ["muscat-search-filter", "/muscat?q=Design&category=creative", 1440, 900],
  ["muscat-sorted", "/muscat?sort=name-desc", 1440, 900],
  ["muscat-profile-desktop", "/muscat/listing/design-workshop", 1440, 900],
  ["muscat-profile-mobile", "/muscat/listing/design-workshop", 390, 844],
  ["dubai-directory", "/dubai", 1440, 900],
  ["doha-directory", "/doha", 1440, 900],
];
const captures = [];
for (const [name, path, width, height] of views) {
  const url = origin + path;
  console.log(`Checking ${name} on loopback`);
  let response;
  for (let attempt = 0; attempt < 5; attempt++) {
    try {
      response = await fetch(url, { redirect: "manual", headers: { connection: "close" } });
      break;
    } catch (error) {
      console.warn(`Transient local fetch error for ${name} (attempt ${attempt + 1}): ${String(error)}`);
      if (attempt === 4) throw error;
      await new Promise(resolve => setTimeout(resolve, 600 * (attempt + 1)));
    }
  }
  if (response.status !== 200) throw new Error(`Unexpected HTTP ${response.status} for ${url}`);
  const html = await response.text();
  if (!/All listings are fictional\./.test(html) || !/noindex, nofollow/.test(html)) throw new Error(`Missing fictional/noindex disclosure: ${path}`);
  const filepath = join(out, name + ".png");
  const args = ["--headless", "--no-sandbox", "--disable-gpu", "--disable-dev-shm-usage", "--hide-scrollbars", "--disable-extensions", "--disable-background-networking", "--disable-software-rasterizer", "--renderer-process-limit=1", "--no-zygote", "--no-first-run", "--force-device-scale-factor=1", `--window-size=${width},${height}`, "--virtual-time-budget=2500", `--screenshot=${filepath}`, url];
  const p = spawnSync(browser, args, { encoding: "utf8", timeout: 25000 });
  if (p.status !== 0 || !existsSync(filepath)) throw new Error(`Screenshot failure on ${name}: ${(p.stderr ?? "").slice(-700)}`);
  const bytes = readFileSync(filepath);
  if (bytes.subarray(0, 8).toString("hex") !== "89504e470d0a1a0a") throw new Error(`Invalid screenshot: ${name}`);
  console.log(`Captured screenshot: ${name} (${bytes.length} bytes)`);
  captures.push({ name, path, viewport: { width, height }, file: name + ".png", bytes: bytes.length, sha256: createHash("sha256").update(bytes).digest("hex") });
}
const sha = spawnSync("git", ["rev-parse", "HEAD"], { encoding: "utf8" }).stdout.trim();
const manifest = { source_commit: sha, time_utc: new Date().toISOString(), browser, origin: "loopback only", captures, excluded: ["real people", "external screenshots", "production endpoints"], limitations: ["Browser screenshots show initial render only; interactive comparison and gallery clicks require manual acceptance verification.", "Visual appearance still requires human review."] };
writeFileSync(join(out, "manifest.json"), JSON.stringify(manifest, null, 2));
const esc = (s) => s.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
const cards = captures.map((c) => `<figure><img loading="lazy" src="${esc(c.file)}" alt="${esc(c.name)} actual browser screenshot"><figcaption>${esc(c.name)} · ${c.viewport.width}×${c.viewport.height} · ${esc(c.path)}</figcaption></figure>`).join("\n");
const page = `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Private visual acceptance — fictional directory</title><style>body{margin:0;background:#101114;color:#f1e8e8;font:16px system-ui}main{max-width:1200px;margin:auto;padding:24px}p{line-height:1.6;color:#ccbdc3}section{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,410px),1fr));gap:24px}figure{margin:0;background:#1d1b20;padding:12px;border:1px solid #58444e}img{max-width:100%;height:auto;display:block}figcaption{padding:12px 0;color:#e0b4af;font-size:13px}</style><main><h1>Three City Directory — Visual acceptance</h1><p>Real screenshots captured on an isolated GitHub Actions runner against a loopback-only Next.js production build. Fictional preview; not a live website. Commit: ${esc(sha)}</p><p><strong>Manual checks remaining:</strong> click both fictional gallery tabs, compare two profiles, keyboard focus, narrow-screen horizontal scrolling, visual polish and screen-reader narration. Screenshots alone do not prove these interactions.</p><section>${cards}</section></main></html>`;
writeFileSync(join(out, "index.html"), page);
console.log(`Captured ${captures.length} screenshots from the actual local Next.js app at ${sha}`);
