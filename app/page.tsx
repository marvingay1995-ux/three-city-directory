import Link from "next/link";
import { DemoNotice, DirectoryFooter, DirectoryHeader } from "../components/directory-ui";
import { cities } from "../lib/directory";

export default function Home() {
  return (
    <div className="shell">
      <DirectoryHeader />
      <main id="main-content" tabIndex={-1}>
        <section className="hero home-hero" aria-labelledby="home-title">
          <div className="hero-inner">
            <DemoNotice />
            <div className="eyebrow"><span className="eyebrow-line" /> CURATED CITY GUIDES / CONCEPT 001</div>
            <h1 id="home-title">Choose your <i>city.</i></h1>
            <p>Browse fictional businesses and services in Dubai, Muscat, and Doha.</p>
            <p className="hero-detail">A discreet, editorial exploration of adult social life, style and city culture. This is a fictional interface prototype—not a live advertising service.</p>
            <Link href="/muscat" className="primary-link">Explore Muscat <span aria-hidden="true">↗</span></Link>
          </div>
          <div className="hero-art" aria-hidden="true"><span className="hero-orbit orbit-one" /><span className="hero-orbit orbit-two" /><span className="hero-star">✳</span><span className="hero-art-caption">CITY / AFTER DARK / 001</span></div>
        </section>
        <section className="section-heading"><div><span className="eyebrow">01 / DESTINATIONS</span><h2>Discover by city<span className="punctuation">.</span></h2></div><p>Three cities. One carefully designed experience.</p></section>
        <nav aria-label="Choose a city" className="city-grid">
          {cities.map((city, index) => (
            <Link key={city.slug} className={`city-card city-card-${city.slug}`} href={`/${city.slug}`}>
              <span className="city-card-top"><span className="city-flag" aria-hidden="true">{city.flag}</span><span className="city-number">0{index + 1} / 03</span></span>
              <span className="city-card-art" aria-hidden="true"><span className="city-art-circle" /></span>
              <span className="city-card-bottom"><span><h2>{city.name}</h2><p>{city.country}</p></span><span className="city-arrow" aria-hidden="true">↗</span></span>
              <span className="city-action" aria-hidden="true">Explore city <span className="directional">→</span></span>
            </Link>
          ))}
        </nav>
        <section className="studio-panel"><span className="eyebrow">THE CONCEPT</span><h2>Thoughtful discovery.<br/><i>By design.</i></h2><p>18+ editorial concept styling only. No age verification is implemented. Every profile is invented; no person, service or venue is being advertised.</p><span className="studio-watermark" aria-hidden="true">✳</span></section>
      </main>
      <DirectoryFooter />
    </div>
  );
}
