import Link from "next/link";
import { cities, type CitySlug } from "../lib/directory";

export function DemoNotice() {
  return <p className="demo-notice"><strong>18+ · Private concept preview</strong><span>All listings are fictional. No contact or transactions.</span></p>;
}

export function DirectoryHeader({ city }: { city?: CitySlug }) {
  return (
    <header className="site-header">
      <Link href="/" className="brand" aria-label="Three City Directory home"><span className="brand-mark" aria-hidden="true">✳</span><span className="brand-words">THREE CITY <em>DIRECTORY</em></span></Link>
      <nav aria-label="Browse cities" className="city-nav">
        {cities.map((item) => (
          <Link key={item.slug} href={`/${item.slug}`} aria-current={item.slug === city ? "page" : undefined}>
            {item.name}
          </Link>
        ))}
      </nav>
      <span className="header-tag">PRIVATE PREVIEW <span aria-hidden="true">●</span> 18+</span>
    </header>
  );
}

export function DirectoryFooter() {
  return <footer><span>THREE CITY DIRECTORY <small>© Concept edition</small></span><span>Fictional listings for demonstration only. No bookings, contact or payments.</span></footer>;
}

export function SponsoredExample() {
  return <span className="sponsored-example">Sponsored — example only</span>;
}
