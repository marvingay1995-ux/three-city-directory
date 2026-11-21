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
  ["home-narrow-320", "/", 320, 760],
  ["muscat-directory-desktop", "/muscat", 1440, 900],
  ["muscat-directory-mobile", "/muscat", 390, 844],
  ["muscat-directory-narrow-320", "/muscat", 320, 760],
  ["muscat-zero-results", "/muscat?q=not-a-fixture-name&category=creative", 390, 844],
  ["muscat-search-filter", "/muscat?q=Design&category=creative", 1440, 900],
  ["muscat-sorted", "/muscat?sort=name-desc", 1440, 900],
  ["muscat-profile-desktop", "/muscat/listing/design-workshop", 1440, 900],
  ["muscat-profile-mobile", "/muscat/listing/design-workshop", 390, 844],
  ["dubai-directory", "/dubai", 1440, 900],
  ["dubai-directory-mobile", "/dubai", 390, 844],
  ["dubai-profile-mobile", "/dubai/listing/creative-studio", 390, 844],
  ["doha-directory", "/doha", 1440, 900],
  ["doha-directory-mobile", "/doha", 390, 844],
  ["doha-profile-mobile", "/doha/listing/modern-atelier", 390, 844],
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
const manifest = { source_commit: sha, time_utc: new Date().toISOString(), browser, origin: "loopback only", captures, excluded: ["real people", "external screenshots", "production endpoints"], limitations: ["Browser screenshots show initial render only; interactive comparison and gallery clicks require separate interactive acceptance verification.", "Visual appearance, screen readers and approval still require human review.", "Screenshot capture does not imply production, accessibility certification or commercial eligibility."] };
writeFileSync(join(out, "manifest.json"), JSON.stringify(manifest, null, 2));
const esc = (s) => s.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
const reviewLinks = captures.map(c => `<a href="#${esc(c.name)}">${esc(c.name)}</a>`).join(" · ");
const reviewCards = captures.map(c => `<figure id="${esc(c.name)}"><a href="${esc(c.file)}" target="_blank" rel="noopener noreferrer" title="Open screenshot full resolution"><img loading="lazy" src="${esc(c.file)}" alt="${esc(c.name)} actual local-browser screenshot"></a><figcaption><strong>${esc(c.name)}</strong><br>${c.viewport.width}×${c.viewport.height} · <code>${esc(c.path)}</code><br><a href="${esc(c.file)}" target="_blank" rel="noopener noreferrer">Open full-size image</a></figcaption></figure>`).join("\\n");
const page = `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>UX-005 — private fictional directory review</title><style>body{margin:0;background:#101114;color:#f1e8e8;font:16px system-ui}main{max-width:1320px;margin:auto;padding:clamp(16px,3vw,36px)}p{line-height:1.6;color:#ccbdc3}a{color:#f1c9bf;text-underline-offset:3px}a:focus-visible{outline:3px solid #efc77e;outline-offset:4px}nav{line-height:2;margin:20px 0;padding:16px;background:#241f25;border-radius:8px}section{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,375px),1fr));gap:18px}figure{margin:0;background:#1d1b20;padding:12px;border:1px solid #58444e;scroll-margin-top:24px}img{width:100%;height:auto;display:block}figcaption{padding:12px 0;color:#e0b4af;font-size:13px;line-height:1.8}code{overflow-wrap:anywhere}ul{line-height:1.8}summary{cursor:pointer;font-weight:700}details{margin:24px 0;padding:20px;border:1px solid #65515b;border-radius:8px}footer{margin:36px 0;color:#b1a2a9}</style><main><h1>UX-005 · Full website review</h1><p>Actual Chromium screenshots of the <strong>fictional, unpublished</strong> directory, captured from a loopback-only Next.js build. Review source commit: <code>${esc(sha)}</code>. Screenshots are not a hosted preview. This gallery contains ${captures.length} independently captured views.</p><nav aria-label="Jump to screenshot"><strong>Jump to a view:</strong> ${reviewLinks}</nav><details open><summary>Human visual acceptance rubric — manual signoff required</summary><ul><li>City navigation and branding consistent across all three locations</li><li>Readable headings, descriptions, footers and fictional disclosure at 320px and 390px</li><li>Profile artwork, captions, spacing and mobile framing acceptable</li><li>Search, filters, zero-results recovery and sorting understandable</li><li>Contrast, keyboard focus, screen reader announcements, motion and zoom checked independently</li><li>No claims of verified people, real photos, age verification or live advertising</li></ul><p>For each finding, record screenshot name, viewport, observed defect, expected result and severity. PASS or FAIL is a <strong>reviewer decision</strong>, not a status inferred from screenshots.</p></details><section>${reviewCards}</section><footer>Demo only. No production hosting, contact, booking, payment or real people. Files may be opened locally with no server.</footer></main></html>`;
writeFileSync(join(out, "index.html"), page);
console.log(`Captured ${captures.length} screenshots from the actual local Next.js app at ${sha}`);
