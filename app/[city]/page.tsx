import Form from "next/form";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DemoNotice, DirectoryFooter, DirectoryHeader } from "../../components/directory-ui";
import { categories, cities, getCity, getListings, normalizeCategory, normalizeSearchQuery, type CategorySlug } from "../../lib/directory";

type CityPageProps = {
  params: Promise<{ city: string }>;
  searchParams: Promise<{ q?: string | string[]; category?: string | string[] }>;
};

export function generateStaticParams() {
  return cities.map(({ slug }) => ({ city: slug }));
}

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
          <DemoNotice />
          <h1 id="city-title">Explore <bdi>{city.name}</bdi></h1>
          <p>{city.country}</p>
        </section>

        <section className="discovery" aria-labelledby="search-title">
          <h2 id="search-title">Find a listing</h2>
          <Form action={path} className="search" key={JSON.stringify([city.slug, query, category])}>
            <label htmlFor="q">Search demo listings</label>
            <div className="search-controls">
              <input id="q" name="q" defaultValue={query} placeholder="Name or category" />
              {category && <input type="hidden" name="category" value={category} />}
              <button type="submit">Search</button>
            </div>
          </Form>
          <nav aria-label="Filter by category" className="category-nav">
            <Link href={categoryHref(path, query)} aria-current={category === undefined ? "true" : undefined} scroll={false}>All categories</Link>
            {categories.map(({ slug, label }) => (
              <Link key={slug} href={categoryHref(path, query, slug)} aria-current={category === slug ? "true" : undefined} scroll={false}>{label}</Link>
            ))}
          </nav>
        </section>

        <section className="results" aria-labelledby="results-title">
          <div className="results-header">
            <div>
              <h2 id="results-title">Directory results</h2>
              <p role="status" aria-atomic="true">{listings.length} {listings.length === 1 ? "listing" : "listings"} in {city.name}</p>
            </div>
            {(query || category) && <Link href={path} scroll={false}>Clear filters</Link>}
          </div>
          {listings.length ? (
            <ul className="listing-grid">
              {listings.map((item) => (
                <li key={item.id}>
                  <article className="listing">
                    <p className="listing-category">{item.category}</p>
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                    <span className="listing-label">Fictional profile</span>
                  </article>
                </li>
              ))}
            </ul>
          ) : (
            <div className="empty-state">
              <h3>No matching demo listings</h3>
              <p>Try a different search term or choose another category.</p>
            </div>
          )}
        </section>
      </main>
      <DirectoryFooter />
    </div>
  );
}
