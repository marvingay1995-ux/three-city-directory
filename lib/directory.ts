export const cities = [{slug:"dubai",name:"Dubai",country:"United Arab Emirates",flag:"🇦🇪"},{slug:"muscat",name:"Muscat",country:"Oman",flag:"🇴🇲"},{slug:"doha",name:"Doha",country:"Qatar",flag:"🇶🇦"}] as const;
export type CitySlug = (typeof cities)[number]["slug"];
export const demoListings = [
{id:"d1",city:"dubai",title:"Creative Studio",category:"Creative",description:"Fictional demonstration business profile."},
{id:"d2",city:"dubai",title:"City Concierge",category:"Lifestyle",description:"Fictional demonstration business profile."},
{id:"m1",city:"muscat",title:"Design Workshop",category:"Creative",description:"Fictional demonstration business profile."},
{id:"m2",city:"muscat",title:"Local Experiences",category:"Lifestyle",description:"Fictional demonstration business profile."},
{id:"q1",city:"doha",title:"Modern Atelier",category:"Creative",description:"Fictional demonstration business profile."},
{id:"q2",city:"doha",title:"Community Guide",category:"Lifestyle",description:"Fictional demonstration business profile."}
] as const;
export function getCity(slug:string){return cities.find(city=>city.slug===slug);}
export const categories = [
  { slug: "creative", label: "Creative" },
  { slug: "lifestyle", label: "Lifestyle" },
] as const;
export type CategorySlug = (typeof categories)[number]["slug"];

export function normalizeCategory(input: unknown): CategorySlug | undefined {
  const values = Array.isArray(input) ? input : [input];
  for (const value of values) {
    if (typeof value !== "string") continue;
    const slug = value.trim().toLowerCase();
    const category = categories.find((item) => item.slug === slug);
    if (category) return category.slug;
  }
}

export function getListings(slug: string, query = "", category?: CategorySlug) {
  const term = query.trim().toLowerCase();
  const categoryLabel = categories.find((item) => item.slug === category)?.label;

  return demoListings.filter((item) =>
    item.city === slug &&
    (!categoryLabel || item.category === categoryLabel) &&
    `${item.title} ${item.category} ${item.description}`.toLowerCase().includes(term)
  );
}

export function normalizeSearchQuery(query: unknown): string {
  const values = Array.isArray(query) ? query : [query];

  for (const value of values) {
    if (typeof value !== "string") continue;
    const term = value.trim();
    // Next.js decodes the parameter and represents invalid UTF-8 with U+FFFD.
    if (term && !/[\u0000-\u001f\u007f\ufffd]/u.test(term)) return term;
  }

  return "";
}
