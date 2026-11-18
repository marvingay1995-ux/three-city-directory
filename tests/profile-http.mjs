import assert from "node:assert/strict";

// Run against a local production build: node tests/profile-http.mjs http://127.0.0.1:3000
const origin = new URL(process.argv[2]);
assert.ok(origin.protocol === "http:" && ["127.0.0.1", "localhost"].includes(origin.hostname));

const profiles = [
  ["dubai", "Dubai", "creative-studio", "Creative Studio", "creative"],
  ["dubai", "Dubai", "city-concierge", "City Concierge", "lifestyle"],
  ["muscat", "Muscat", "design-workshop", "Design Workshop", "creative"],
  ["muscat", "Muscat", "local-experiences", "Local Experiences", "lifestyle"],
  ["doha", "Doha", "modern-atelier", "Modern Atelier", "creative"],
  ["doha", "Doha", "community-guide", "Community Guide", "lifestyle"],
];
const request = (path) => fetch(new URL(path, origin), { redirect: "manual" });

for (const [city, cityName, slug, title, category] of profiles) {
  const path = `/${city}/listing/${slug}`;
  const profile = await request(path);
  assert.equal(profile.status, 200, path);
  const html = (await profile.text()).replaceAll("<!-- -->", "");
  assert.ok(html.includes(`<title>${title} in ${cityName} | Three City Directory Demo</title>`), path);
  assert.match(html, /<meta name="description" content="Fictional /);
  assert.match(html, /<meta name="robots" content="noindex, nofollow"/);
  assert.ok(html.includes("All listings are fictional."));
  assert.ok(html.includes("Reporting prototype"));
  assert.ok(html.includes("Overview image placeholder"));
  assert.equal(html.includes("Sponsored — example only"), slug === "creative-studio");
  assert.ok(html.includes(`href="/${city}?category=${category}"`));
  assert.ok(html.includes(`href="/${city}">Back to the ${cityName} directory`));

  const filtered = await request(`/${city}?q=${encodeURIComponent(title.toUpperCase())}&category=${category}`);
  assert.equal(filtered.status, 200);
  const directory = await filtered.text();
  assert.ok(directory.includes(`href="${path}">${title}</a>`));
  assert.ok(directory.includes("Fictional profile"));
  assert.equal(directory.includes("Sponsored — example only"), slug === "creative-studio");

  for (const otherCity of ["dubai", "muscat", "doha"].filter((item) => item !== city)) {
    assert.equal((await request(`/${otherCity}/listing/${slug}`)).status, 404);
  }
}

for (const path of [
  "/unknown/listing/creative-studio",
  "/dubai/listing/unknown",
  "/muscat/listing",
  "/doha/listing/modern%2Fatelier",
]) {
  assert.equal((await request(path)).status, 404, path);
}

for (const path of ["/dubai/listing/%FF", "/dubai/listing/%"]) {
  const status = (await request(path)).status;
  assert.ok(status === 400 || status === 404, `${path}: ${status}`);
}

console.log("Passed six profile pages and filtered directory links, 12 cross-city 404s, four invalid-route 404s, and two malformed encoding checks.");

for (const path of ["/admin", "/admin/moderation", "/api/admin", "/api/moderation"]) {
  assert.equal((await request(path)).status, 404, path);
}
console.log("Offline boundary verified: admin and moderation URLs return 404.");

for (const path of ["/ads", "/advertising", "/api/ads", "/api/advertising", "/admin/ads"]) {
  assert.equal((await request(path)).status, 404, path);
}
assert.ok(!(await (await request("/dubai")).text()).includes("Sponsored — simulation only"));
console.log("Advertising prototype remains offline and public advertising URLs return 404.");
