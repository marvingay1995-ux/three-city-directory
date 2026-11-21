import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DemoNotice, DirectoryFooter, DirectoryHeader, SponsoredExample } from "../../../../components/directory-ui";
import { DemoGallery } from "../../../../components/demo-gallery";
import { getDemoEditorial } from "../../../../lib/demo-editorial";
import { demoListings, getCity, getListing, getListings, getListingPath, normalizeCategory } from "../../../../lib/directory";

type ProfileProps = { params: Promise<{ city: string; slug: string }> };
export function generateStaticParams() { return demoListings.map(({ city, slug }) => ({ city, slug })); }
async function resolveProfile(params: ProfileProps["params"]) {
  const { city: citySlug, slug } = await params;
  const city = getCity(citySlug);
  if (!city) notFound();
  const listing = getListing(city.slug, slug);
  if (!listing) notFound();
  return { city, listing };
}
export async function generateMetadata({ params }: ProfileProps): Promise<Metadata> {
  const { city, listing } = await resolveProfile(params);
  return {
    title: `${listing.title} in ${city.name} | Three City Directory Demo`,
    description: `Fictional ${listing.category.toLowerCase()} profile for ${listing.title} in ${city.name}. For demonstration only.`,
  };
}
export default async function ProfilePage({ params }: ProfileProps) {
  const { city, listing } = await resolveProfile(params);
  const directory = `/${city.slug}`;
  const category = normalizeCategory(listing.category);
  const editorial = getDemoEditorial(listing.id);
  const related = getListings(city.slug).filter(item => item.id !== listing.id).slice(0, 3);
  return <div className="shell">
    <DirectoryHeader city={city.slug} />
    <main id="main-content" className="profile" tabIndex={-1}>
      <nav className="breadcrumbs" aria-label="Breadcrumb"><ol>
        <li><Link href="/">Home</Link></li>
        <li><Link href={directory}>{city.name}</Link></li>
        {category && <li><Link href={{ pathname: directory, query: { category } }}>{listing.category}</Link></li>}
        <li aria-current="page">{listing.title}</li>
      </ol></nav>
      <section className="hero profile-hero" aria-labelledby="profile-title">
        <DemoNotice />
        <span className="eyebrow">FICTIONAL PROFILE / {city.name.toUpperCase()}</span>
        <h1 id="profile-title"><bdi>{listing.title}</bdi><span className="punctuation">.</span></h1>
        <p>{listing.category} in <bdi>{city.name}</bdi>, {city.country}.</p>
        <p>{listing.description}</p>
        {editorial && <div className={`editorial-intro editorial-${editorial.theme}`}><strong>{editorial.tagline}</strong><p>{editorial.summary}</p></div>}
        <div className="profile-badges"><span className="listing-label">Fictional profile</span>{listing.sponsoredExample && <SponsoredExample />}</div>
      </section>
      <section className="profile-gallery" aria-labelledby="gallery-title">
        <div className="section-heading compact"><div><span className="eyebrow">01 / GALLERY</span><h2 id="gallery-title">A closer look<span className="punctuation">.</span></h2></div><span className="results-small">CONCEPT IMAGERY ONLY</span></div>
        <DemoGallery title={listing.title} theme={editorial?.theme} />
      </section>
      <nav className="profile-shortcuts" aria-label="Profile sections">
        <a href="#details-title">Profile details</a>
        <a href="#report-title">Safety and reporting</a>
        <Link href={directory}>Explore more in {city.name}</Link>
      </nav>
      {editorial && <section className="profile-editorial" aria-labelledby="editorial-heading"><span className="eyebrow">CONCEPT PROFILE / FICTIONAL</span><h2 id="editorial-heading">Inside the concept</h2><p>{editorial.summary}</p><ul>{editorial.highlights.map((text) => <li key={text}>{text}</li>)}</ul><p className="editorial-disclaimer">These interests are invented editorial themes, not offered services or verified business attributes.</p></section>}
      <section className="profile-details" aria-labelledby="details-title">
        <span className="eyebrow">02 / INFORMATION</span><h2 id="details-title">Profile details</h2>
        <dl>
          <div><dt>Location</dt><dd>{city.name} (city only)</dd></div>
          <div><dt>Hours</dt><dd>Unavailable in this demo</dd></div>
          <div><dt>Verification</dt><dd>Demo fixture. No business verification was performed.</dd></div>
        </dl>
      </section>
      {related.length > 0 && <section className="profile-related" aria-labelledby="related-title">
        <div className="related-heading"><div><span className="eyebrow">03 / KEEP EXPLORING</span><h2 id="related-title">More fictional profiles in {city.name}</h2></div><Link href={directory}>All {city.name} listings <span aria-hidden="true">↗</span></Link></div>
        <ul className="related-list">
          {related.map(item => {
            const details = getDemoEditorial(item.id);
            return <li key={item.id}><article className={`related-card related-${details?.theme ?? "copper"}`}>
              <span className="related-art" aria-hidden="true">{item.category === "Creative" ? "✳" : "◈"}</span>
              <div><p className="related-type">{item.category} / Fictional demo</p><h3><Link href={getListingPath(item)}>{item.title}</Link></h3>{details && <p className="related-tagline">{details.tagline}</p>}</div>
              <Link href={getListingPath(item)} aria-label={`Explore fictional profile ${item.title}`} className="related-arrow">↗</Link>
            </article></li>;
          })}
        </ul>
        <p className="related-note">These are invented editorial examples, not recommendations of real people or businesses.</p>
      </section>}
      <aside className="profile-report" aria-labelledby="report-title">
        <span className="eyebrow">SAFETY & TRANSPARENCY</span><h2 id="report-title">Reporting prototype</h2>
        <p>Reporting is unavailable in this demo. Reports cannot be submitted or stored.</p>
      </aside>
      <Link className="text-link" href={directory}>Back to the {city.name} directory</Link>
    </main><DirectoryFooter />
  </div>;
}
