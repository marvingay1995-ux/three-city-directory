export const cities = [{slug:"dubai",name:"Dubai",country:"United Arab Emirates",flag:"🇦🇪"},{slug:"muscat",name:"Muscat",country:"Oman",flag:"🇴🇲"},{slug:"doha",name:"Doha",country:"Qatar",flag:"🇶🇦"}] as const;
export type CitySlug = (typeof cities)[number]["slug"];
export type DemoListing = {
  readonly id: string;
  readonly city: CitySlug;
  readonly slug: string;
  readonly title: string;
  readonly category: (typeof categories)[number]["label"];
  readonly description: string;
  readonly sponsoredExample?: true;
};

export const demoListings: readonly DemoListing[] = [
{id:"d1",slug:"creative-studio",city:"dubai",title:"Creative Studio",sponsoredExample:true,category:"Creative",description:"Fictional demonstration business profile."},
{id:"d2",slug:"city-concierge",city:"dubai",title:"City Concierge",category:"Lifestyle",description:"Fictional demonstration business profile."},
{id:"m1",slug:"design-workshop",city:"muscat",title:"Design Workshop",category:"Creative",description:"Fictional demonstration business profile."},
{id:"m2",slug:"local-experiences",city:"muscat",title:"Local Experiences",category:"Lifestyle",description:"Fictional demonstration business profile."},
{id:"q1",slug:"modern-atelier",city:"doha",title:"Modern Atelier",category:"Creative",description:"Fictional demonstration business profile."},
{id:"q2",slug:"community-guide",city:"doha",title:"Community Guide",category:"Lifestyle",description:"Fictional demonstration business profile."}
];
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

export function getListing(city: CitySlug, slug: string): DemoListing | undefined {
  return demoListings.find((listing) => listing.city === city && listing.slug === slug);
}

export function getListingPath({ city, slug }: Pick<DemoListing, "city" | "slug">): string {
  return `/${city}/listing/${slug}`;
}
