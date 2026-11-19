import { DirectorySearch } from "../../components/directory-search";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DemoNotice, DirectoryFooter, DirectoryHeader, SponsoredExample } from "../../components/directory-ui";
import { categories, cities, getCity, getListingPath, getListings, normalizeCategory, normalizeSearchQuery, type CategorySlug } from "../../lib/directory";

type CityPageProps = {
  params: Promise<{ city: string }>;
  searchParams: Promise<{ q?: string | string[]; category?: string | string[] }>;
};
export function generateStaticParams() { return cities.map(({ slug }) => ({ city: slug })); }
function categoryHref(path: string, query: string, category?: CategorySlug) {
  const params = new URLSearchParams();
  if (query) params.set("q", query);
  if (category) params.set("category", category);
  const search = params.toString();
  return search ? `${path}?${search}` : path;
}
export default async function CityPage({ params, searchParams }: CityPageProps) {
  const city = getCity((await params).city);
  if (!city) notFound();
  const input = await searchParams;
  const query = normalizeSearchQuery(input.q);
  const category = normalizeCategory(input.category);
  const path = `/${city.slug}`;
  const listings = getListings(city.slug, query, category);
  return (
    <div className="shell">
      <DirectoryHeader city={city.slug} />
      <main id="main-content" tabIndex={-1}>
        <section className="hero city-hero" aria-labelledby="city-title">
          <div className="city-heading"><div><DemoNotice /><span className="eyebrow">DESTINATION GUIDE / {city.country.toUpperCase()}</span><h1 id="city-title">Explore <bdi><i>{city.name}</i></bdi></h1><p>{city.country}</p><p className="city-hero-detail">A curated fictional look at creative spaces and lifestyle culture across the city.</p></div><div className="city-deco" aria-hidden="true">{city.flag}<span>03 / CITIES</span></div></div>
        </section>
        <section className="discovery" aria-labelledby="search-title">
          <div className="filter-heading"><div><span className="eyebrow">YOUR DISCOVERY STARTS HERE</span><h2 id="search-title">Find a listing</h2></div><span className="results-small">PRIVATE DEMONSTRATION</span></div>
          <DirectorySearch path={path} query={query} category={category} />
          <nav aria-label="Filter by category" className="category-nav">
            <Link href={categoryHref(path, query)} aria-current={category === undefined ? "true" : undefined} scroll={false}>All categories</Link>
            {categories.map(({ slug, label }) => (
              <Link key={slug} href={categoryHref(path, query, slug)} aria-current={category === slug ? "true" : undefined} scroll={false}>{label}</Link>
            ))}
          </nav>
        </section>
        <section className="results" aria-labelledby="results-title">
          <div className="results-header"><div><span className="eyebrow">02 / EDITORIAL DIRECTORY</span><h2 id="results-title">Directory results</h2><p role="status" aria-atomic="true">{listings.length} {listings.length === 1 ? "listing" : "listings"} in {city.name}</p></div>{(query || category) && <Link href={path} scroll={false}>Clear filters</Link>}</div>
          {listings.length ? <ul className="listing-grid">
            {listings.map((item, index) => (
              <li key={item.id}><article className="listing">
                <Link href={getListingPath(item)} className={`listing-visual visual-${item.category.toLowerCase()}`} aria-label={`Explore ${item.title}`}><span className="visual-symbol" aria-hidden="true">{item.category === "Creative" ? "✳" : "◈"}</span><span className="visual-number">0{index + 1}</span></Link>
                <div className="listing-content"><p className="listing-category">{item.category} / {city.name}</p><h3 className="listing-title"><Link href={getListingPath(item)}>{item.title}</Link></h3><p>{item.description}</p><span className="listing-label">Fictional profile</span>{item.sponsoredExample && <SponsoredExample />}<Link className="listing-open" href={getListingPath(item)}>View profile <span aria-hidden="true">↗</span></Link></div>
              </article></li>
            ))}
          </ul> : <div className="empty-state"><h3>No matching demo listings</h3><p>Try a different search term or choose another category.</p></div>}
        </section>
      </main>
      <DirectoryFooter />
    </div>
  );
}
