import { DemoCompare } from "../../components/demo-compare";
import { DirectorySearch } from "../../components/directory-search";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DemoNotice, DirectoryFooter, DirectoryHeader } from "../../components/directory-ui";
import { categories, cities, getCity, getListings, normalizeCategory, normalizeSearchQuery, normalizeListingSort, type ListingSort, type CategorySlug } from "../../lib/directory";

type CityPageProps = {
  params: Promise<{ city: string }>;
  searchParams: Promise<{ q?: string | string[]; category?: string | string[]; sort?: string | string[] }>;
};
export function generateStaticParams() { return cities.map(({ slug }) => ({ city: slug })); }
function categoryHref(path: string, query: string, category?: CategorySlug, sort: ListingSort = "original") {
  const params = new URLSearchParams();
  if (query) params.set("q", query);
  if (category) params.set("category", category);
  if (sort !== "original") params.set("sort", sort);
  const search = params.toString();
  return search ? `${path}?${search}` : path;
}
function sortHref(path: string, query: string, category: CategorySlug | undefined, sort: ListingSort) {
  return categoryHref(path, query, category, sort);
}
export default async function CityPage({ params, searchParams }: CityPageProps) {
  const city = getCity((await params).city);
  if (!city) notFound();
  const input = await searchParams;
  const query = normalizeSearchQuery(input.q);
  const category = normalizeCategory(input.category);
  const sort = normalizeListingSort(input.sort);
  const path = `/${city.slug}`;
  const listings = getListings(city.slug, query, category, sort);
  return (
    <div className="shell">
      <DirectoryHeader city={city.slug} />
      <main id="main-content" tabIndex={-1}>
        <section className="hero city-hero" aria-labelledby="city-title">
          <div className="city-heading"><div><DemoNotice /><span className="eyebrow">DESTINATION GUIDE / {city.country.toUpperCase()}</span><h1 id="city-title">Explore <bdi><i>{city.name}</i></bdi></h1><p>{city.country}</p><p className="city-hero-detail">A curated fictional look at creative spaces and lifestyle culture across the city.</p></div><div className="city-deco" aria-hidden="true">{city.flag}<span>03 / CITIES</span></div></div>
        </section>
        <section className="discovery" aria-labelledby="search-title">
          <div className="filter-heading"><div><span className="eyebrow">YOUR DISCOVERY STARTS HERE</span><h2 id="search-title">Find a listing</h2></div><span className="results-small">PRIVATE DEMONSTRATION</span></div>
          <DirectorySearch path={path} query={query} category={category} sort={sort} />
          <nav aria-label="Filter by category" className="category-nav">
            <Link href={categoryHref(path, query, undefined, sort)} aria-current={category === undefined ? "true" : undefined} scroll={false}>All categories</Link>
            {categories.map(({ slug, label }) => (
              <Link key={slug} href={categoryHref(path, query, slug, sort)} aria-current={category === slug ? "true" : undefined} scroll={false}>{label}</Link>
            ))}
          </nav>
        </section>
        <section className="results" aria-labelledby="results-title">
          <div className="results-header"><div><span className="eyebrow">02 / EDITORIAL DIRECTORY</span><h2 id="results-title">Directory results</h2><p role="status" aria-atomic="true">{listings.length} {listings.length === 1 ? "listing" : "listings"} in {city.name}</p></div>{(query || category || sort !== "original") && <Link href={path} scroll={false}>Clear filters</Link>}</div>
          <nav className="sort-nav" aria-label="Sort fictional listings">
            <span>Sort by</span>
            <Link href={sortHref(path, query, category, "original")} aria-current={sort === "original" ? "true" : undefined} scroll={false}>Original order</Link>
            <Link href={sortHref(path, query, category, "name-asc")} aria-current={sort === "name-asc" ? "true" : undefined} scroll={false}>Name A–Z</Link>
            <Link href={sortHref(path, query, category, "name-desc")} aria-current={sort === "name-desc" ? "true" : undefined} scroll={false}>Name Z–A</Link>
          </nav>
          {listings.length ? <DemoCompare listings={listings} city={city.name} /> : <div className="empty-state"><h3>No matching demo listings</h3><p>Try a different search term or choose another category.</p></div>}
        </section>
      </main>
      <DirectoryFooter />
    </div>
  );
}
