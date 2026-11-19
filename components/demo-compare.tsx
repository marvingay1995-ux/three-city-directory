"use client";

import Link from "next/link";
import { useState } from "react";
import { SponsoredExample } from "./directory-ui";
import { getListingPath, type DemoListing } from "../lib/directory";

const MAX_COMPARE = 2;

export function DemoCompare({ listings, city }: { listings: readonly DemoListing[]; city: string }) {
  const [selected, setSelected] = useState<readonly string[]>([]);
  const chosen = listings.filter((item) => selected.includes(item.id));
  const toggle = (id: string) => {
    setSelected((current) => current.includes(id)
      ? current.filter((item) => item !== id)
      : current.length < MAX_COMPARE ? [...current, id] : current);
  };
  return <>
    <div className="compare-intro"><p>Compare up to two fictional profiles from {city}. Selections stay on this page only.</p><span aria-live="polite">{chosen.length} of {MAX_COMPARE} selected</span></div>
    <ul className="listing-grid">
      {listings.map((item, index) => <li key={item.id}>
        <article className="listing">
          <Link href={getListingPath(item)} className={`listing-visual visual-${item.category.toLowerCase()}`} aria-label={`Explore ${item.title}`}>
            <span className="visual-symbol" aria-hidden="true">{item.category === "Creative" ? "✳" : "◈"}</span>
            <span className="visual-number">0{index + 1}</span>
          </Link>
          <div className="listing-content">
            <p className="listing-category">{item.category} / {city}</p>
            <h3 className="listing-title"><Link href={getListingPath(item)}>{item.title}</Link></h3>
            <p>{item.description}</p>
            <span className="listing-label">Fictional profile</span>
            {item.sponsoredExample && <SponsoredExample />}
            <button type="button" className="compare-toggle" aria-pressed={selected.includes(item.id)}
              disabled={!selected.includes(item.id) && selected.length === MAX_COMPARE}
              onClick={() => toggle(item.id)}>
              {selected.includes(item.id) ? "Remove from comparison" : "Compare this profile"}
            </button>
            <Link className="listing-open" href={getListingPath(item)}>View profile <span aria-hidden="true">↗</span></Link>
          </div>
        </article>
      </li>)}
    </ul>
    {chosen.length > 0 && <section className="compare-panel" aria-labelledby="compare-heading">
      <div className="compare-panel-head"><div><span className="eyebrow">PRIVATE CONCEPT TOOL</span><h3 id="compare-heading">Your comparison</h3></div>
        <button type="button" onClick={() => setSelected([])} className="compare-clear">Clear selection</button>
      </div>
      <p>{chosen.length === 1 ? "Select one more fictional profile to compare." : "Showing two fictional profiles. No results are saved."}</p>
      <div className="compare-table-wrap"><table className="compare-table">
        <caption>Fictional profile comparison for {city}</caption>
        <thead><tr><th scope="col">Attribute</th>{chosen.map(item => <th scope="col" key={item.id}><Link href={getListingPath(item)}>{item.title}</Link></th>)}</tr></thead>
        <tbody>
          <tr><th scope="row">City</th>{chosen.map(item => <td key={item.id}>{city}</td>)}</tr>
          <tr><th scope="row">Category</th>{chosen.map(item => <td key={item.id}>{item.category}</td>)}</tr>
          <tr><th scope="row">Verification</th>{chosen.map(item => <td key={item.id}>Fictional demo — not verified</td>)}</tr>
          <tr><th scope="row">Sponsorship</th>{chosen.map(item => <td key={item.id}>{item.sponsoredExample ? "Example only" : "None"}</td>)}</tr>
        </tbody>
      </table></div>
    </section>}
  </>;
}
