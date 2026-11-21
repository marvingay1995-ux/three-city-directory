import Link from "next/link";
import { getListingPath, type CategorySlug, type CitySlug, type ListingSort, type DemoListing } from "../lib/directory";
import { getDemoEditorial } from "../lib/demo-editorial";

function recoveryHref(city: CitySlug, query: string, category: CategorySlug | undefined, sort: ListingSort) {
  const params = new URLSearchParams();
  if (query) params.set("q", query);
  if (category) params.set("category", category);
  if (sort !== "original") params.set("sort", sort);
  return "/" + city + (params.size ? "?" + params.toString() : "");
}

export function EmptyResults({
  city, cityName, query, category, sort, alternatives,
}: {
  city: CitySlug; cityName: string; query: string; category?: CategorySlug; sort: ListingSort; alternatives: readonly DemoListing[];
}) {
  return <section className="empty-state empty-recovery" aria-labelledby="empty-heading">
    <span className="eyebrow">NO MATCHES / FICTIONAL DIRECTORY</span>
    <h3 id="empty-heading">No matching demo listings in {cityName}</h3>
    <p>{query ? <>Nothing matched your search in {cityName}. Try a shorter term or clear the search.</> : <>No fictional listings match the selected category in {cityName}.</>}</p>
    <nav className="empty-actions" aria-label="Recover from empty search results">
      {query && <Link href={recoveryHref(city, "", category, sort)}>Clear search term</Link>}
      {category && <Link href={recoveryHref(city, query, undefined, sort)}>Remove category filter</Link>}
      <Link href={"/" + city} className="empty-primary">Browse all {cityName} examples <span aria-hidden="true">↗</span></Link>
    </nav>
    {alternatives.length > 0 && <div className="empty-alternatives">
      <h4>Or explore these fictional examples</h4>
      <ul>{alternatives.slice(0, 2).map(item => <li key={item.id}>
        <Link href={getListingPath(item)}>{item.title}</Link>
        <span>{getDemoEditorial(item.id)?.tagline ?? item.category}</span>
      </li>)}</ul>
    </div>}
    <p className="empty-disclaimer">These suggestions are invented and shown only for this private demonstration.</p>
  </section>;
}
