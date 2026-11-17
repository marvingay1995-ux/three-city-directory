import Link from "next/link";
import { cities, type CitySlug } from "../lib/directory";

export function DemoNotice() {
  return <p className="demo-notice"><strong>Demo only</strong><span>All listings are fictional.</span></p>;
}

export function DirectoryHeader({ city }: { city?: CitySlug }) {
  return (
    <header className="site-header">
      <Link href="/" className="brand">Three City <span>Directory</span></Link>
      {city && (
        <nav aria-label="Switch city" className="city-nav">
          {cities.map((item) => (
            <Link key={item.slug} href={`/${item.slug}`} aria-current={item.slug === city ? "page" : undefined}>
              {item.name}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}

export function DirectoryFooter() {
  return <footer>Three City Directory <span>Fictional listings for demonstration only.</span></footer>;
}

export function SponsoredExample() {
  return <span className="sponsored-example">Sponsored — example only</span>;
}
