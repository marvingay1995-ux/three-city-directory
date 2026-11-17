import Link from "next/link";
import { DemoNotice, DirectoryFooter, DirectoryHeader } from "../components/directory-ui";
import { cities } from "../lib/directory";

export default function Home() {
  return (
    <div className="shell">
      <DirectoryHeader />
      <main id="main-content" tabIndex={-1}>
        <section className="hero" aria-labelledby="home-title">
          <DemoNotice />
          <h1 id="home-title">Choose your city.</h1>
          <p>Browse fictional businesses and services in Dubai, Muscat, and Doha.</p>
        </section>
        <nav aria-label="Choose a city" className="city-grid">
          {cities.map((city) => (
            <Link key={city.slug} className="city-card" href={`/${city.slug}`}>
              <span className="city-flag" aria-hidden="true">{city.flag}</span>
              <h2>{city.name}</h2>
              <p>{city.country}</p>
              <span className="city-action" aria-hidden="true">Explore city <span className="directional">→</span></span>
            </Link>
          ))}
        </nav>
      </main>
      <DirectoryFooter />
    </div>
  );
}
