import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DemoNotice, DirectoryFooter, DirectoryHeader, SponsoredExample } from "../../../../components/directory-ui";
import { demoListings, getCity, getListing, normalizeCategory } from "../../../../lib/directory";

type ProfileProps = {
  params: Promise<{ city: string; slug: string }>;
};

export function generateStaticParams() {
  return demoListings.map(({ city, slug }) => ({ city, slug }));
}

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

  return (
    <div className="shell">
      <DirectoryHeader city={city.slug} />
      <main id="main-content" className="profile" tabIndex={-1}>
        <nav className="breadcrumbs" aria-label="Breadcrumb">
          <ol>
            <li><Link href="/">Home</Link></li>
            <li><Link href={directory}>{city.name}</Link></li>
            {category && <li><Link href={{ pathname: directory, query: { category } }}>{listing.category}</Link></li>}
            <li aria-current="page">{listing.title}</li>
          </ol>
        </nav>

        <section className="hero profile-hero" aria-labelledby="profile-title">
          <DemoNotice />
          <h1 id="profile-title"><bdi>{listing.title}</bdi></h1>
          <p>{listing.category} in <bdi>{city.name}</bdi>, {city.country}.</p>
          <p>{listing.description}</p>
          {listing.sponsoredExample && <SponsoredExample />}
        </section>

        <section className="profile-gallery" aria-labelledby="gallery-title">
          <h2 id="gallery-title">Gallery</h2>
          <div className="gallery-grid">
            <figure>
              <div className="gallery-placeholder gallery-primary" aria-hidden="true" />
              <figcaption>Overview image placeholder</figcaption>
            </figure>
            <figure>
              <div className="gallery-placeholder gallery-secondary" aria-hidden="true" />
              <figcaption>Detail image placeholder</figcaption>
            </figure>
          </div>
        </section>

        <section className="profile-details" aria-labelledby="details-title">
          <h2 id="details-title">Profile details</h2>
          <dl>
            <div><dt>Location</dt><dd>{city.name} (city only)</dd></div>
            <div><dt>Hours</dt><dd>Unavailable in this demo</dd></div>
            <div><dt>Verification</dt><dd>Demo fixture. No business verification was performed.</dd></div>
          </dl>
        </section>

        <aside className="profile-report" aria-labelledby="report-title">
          <h2 id="report-title">Reporting prototype</h2>
          <p>Reporting is unavailable in this demo. Reports cannot be submitted or stored.</p>
        </aside>

        <Link className="text-link" href={directory}>Back to the {city.name} directory</Link>
      </main>
      <DirectoryFooter />
    </div>
  );
}
