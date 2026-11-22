"use client";
import { useState } from "react";
import Link from "next/link";

type Role = "visitor" | "advertiser";
const examples = [
  { title: "Creative Studio", city: "Dubai", status: "Fictional preview", category: "Creative" },
  { title: "City Concierge", city: "Dubai", status: "Fictional preview", category: "Lifestyle" },
  { title: "Design Atelier", city: "Muscat", status: "Fictional preview", category: "Creative" }
];
export default function DashboardDemo() {
  const [role, setRole] = useState<Role>("visitor");
  const [tab, setTab] = useState<"overview" | "saved" | "listings">("overview");
  const [saved, setSaved] = useState<string[]>([]);
  const toggleSaved = (title: string) => setSaved(current => current.includes(title) ? current.filter(x => x !== title) : [...current, title]);
  const changeRole = (next: Role) => { setRole(next); setTab("overview"); };
  return <section className="dashboard-demo" aria-labelledby="dashboard-title">
    <p className="eyebrow">UI-006 / INTERACTIVE ACCOUNT DASHBOARD</p>
    <h1 id="dashboard-title">Account dashboard <i>preview.</i></h1>
    <p className="dashboard-disclaimer" role="note"><strong>Fictional demonstration only.</strong> No account, login session, stored favorites, real advertisers, payments, or publishing functions exist. Changes reset when this page reloads.</p>
    <div className="dashboard-roles" aria-label="Preview account role">
      <button type="button" aria-pressed={role === "visitor"} onClick={() => changeRole("visitor")}>Visitor preview</button>
      <button type="button" aria-pressed={role === "advertiser"} onClick={() => changeRole("advertiser")}>Advertiser preview</button>
    </div>
    <div className="dashboard-layout">
      <nav className="dashboard-menu" aria-label="Dashboard sections">
        <button type="button" aria-current={tab === "overview" ? "page" : undefined} onClick={() => setTab("overview")}>Overview</button>
        <button type="button" aria-current={tab === "saved" ? "page" : undefined} onClick={() => setTab("saved")}>{role === "visitor" ? "Saved examples" : "Plan preview"}</button>
        <button type="button" aria-current={tab === "listings" ? "page" : undefined} onClick={() => setTab("listings")}>{role === "visitor" ? "Explore listings" : "Listing preview"}</button>
      </nav>
      <div className="dashboard-panel">
        {tab === "overview" && <><span className="eyebrow">{role.toUpperCase()} / DEMO</span><h2>{role === "visitor" ? "Your discovery space" : "Your advertising workspace"}</h2><p>{role === "visitor" ? "Explore fictional profiles and try saving examples in this page." : "Preview how an advertiser dashboard could organize fictional listing drafts and account status."}</p><div className="dashboard-stats"><div><strong>{role === "visitor" ? saved.length : 0}</strong><span>{role === "visitor" ? "Saved this session" : "Published listings"}</span></div><div><strong>{role === "visitor" ? "3" : "Demo"}</strong><span>{role === "visitor" ? "Example profiles" : "Account status"}</span></div></div></>}
        {tab === "saved" && (role === "visitor" ? <><h2>Saved examples</h2><p>Favorites stay only in this page&apos;s temporary state.</p>{saved.length ? <ul>{saved.map(title => <li key={title}>{title}</li>)}</ul> : <p>No examples selected. Open Explore listings to try it.</p>}</> : <><h2>Advertising plan preview</h2><p>Example only — no subscriptions, payment processing, or activation.</p><div className="dashboard-plan"><strong>Free demonstration</strong><span>0 active advertisements</span><span>No checkout available</span></div></>)}
        {tab === "listings" && <><h2>{role === "visitor" ? "Explore fictional listings" : "Fictional listing drafts"}</h2><p>{role === "visitor" ? "Try saving a fictional example." : "These are static samples, not your advertisements. Creation and publication are disabled."}</p><div className="dashboard-examples">{examples.map(item => <article key={item.title}><span className="eyebrow">{item.city} / {item.category}</span><h3>{item.title}</h3><p>{item.status}</p>{role === "visitor" && <button type="button" aria-pressed={saved.includes(item.title)} onClick={() => toggleSaved(item.title)}>{saved.includes(item.title) ? "Remove saved" : "Save example"}</button>}</article>)}</div></>}
      </div>
    </div>
    <p className="account-return"><Link href="/profile-editor">Fictional profile editor</Link> · <Link href="/account">← Account form demo</Link> · <Link href="/">Back to directory</Link></p>
  </section>;
}
