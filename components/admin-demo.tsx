"use client";
import { useMemo, useState } from "react";
import Link from "next/link";

type Status = "Pending" | "Approved" | "Rejected";
type Item = { id: string; title: string; city: "Dubai" | "Muscat" | "Doha"; category: string; status: Status; note: string };
const initial: Item[] = [
  { id: "AD-001", title: "Creative Studio", city: "Dubai", category: "Creative", status: "Pending", note: "Fictional editorial example" },
  { id: "AD-002", title: "Design Workshop", city: "Muscat", category: "Creative", status: "Pending", note: "Fictional editorial example" },
  { id: "AD-003", title: "Community Guide", city: "Doha", category: "Lifestyle", status: "Rejected", note: "Fictional editorial example" }
];
export default function AdminDemo() {
  const [items, setItems] = useState<Item[]>(initial);
  const [filter, setFilter] = useState<Status | "All">("All");
  const [selected, setSelected] = useState("AD-001");
  const [reason, setReason] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const current = items.find(item => item.id === selected);
  const shown = items.filter(item => filter === "All" || item.status === filter);
  const counts = useMemo(() => ({ pending: items.filter(x => x.status === "Pending").length, approved: items.filter(x => x.status === "Approved").length, rejected: items.filter(x => x.status === "Rejected").length }), [items]);
  const decide = (status: Status) => {
    if (!current || status === "Pending" || !reason.trim()) return;
    setItems(list => list.map(item => item.id === current.id ? { ...item, status } : item));
    setHistory(list => [current.id + " · " + status + " · " + reason.trim().slice(0, 140), ...list].slice(0, 12));
    setReason("");
  };
  const reset = () => { setItems(initial); setHistory([]); setReason(""); setFilter("All"); setSelected("AD-001"); };
  return <section className="admin-demo" aria-labelledby="admin-title">
    <p className="eyebrow">UI-008 / OPERATOR INTERFACE DEMONSTRATION</p>
    <h1 id="admin-title">Moderation <i>dashboard.</i></h1>
    <p className="dashboard-disclaimer" role="note"><strong>Publicly accessible fictional prototype — not a secure administrator area.</strong> No login or access controls exist. All profiles are invented; review decisions affect only this page and reset on reload. Nothing is approved or published on the live directory.</p>
    <div className="admin-stats" aria-label="Fictional review counts"><div><strong>{counts.pending}</strong><span>Pending</span></div><div><strong>{counts.approved}</strong><span>Approved in preview</span></div><div><strong>{counts.rejected}</strong><span>Rejected in preview</span></div></div>
    <div className="admin-layout">
      <section className="admin-queue" aria-labelledby="admin-queue-title">
        <div className="admin-heading"><h2 id="admin-queue-title">Review queue</h2><button type="button" onClick={reset}>Reset demo</button></div>
        <label className="admin-filter">Filter status<select value={filter} onChange={e => setFilter(e.target.value as Status | "All")}><option>All</option><option>Pending</option><option>Approved</option><option>Rejected</option></select></label>
        <div className="admin-items">{shown.length ? shown.map(item => <button type="button" key={item.id} className="admin-item" aria-pressed={selected === item.id} onClick={() => { setSelected(item.id); setReason(""); }}><span className="eyebrow">{item.id} / {item.city}</span><strong>{item.title}</strong><span>{item.status}</span></button>) : <p>No fictional entries match this filter.</p>}</div>
      </section>
      <section className="admin-review" aria-labelledby="admin-review-title">
        <h2 id="admin-review-title">Review details</h2>
        {current ? <><p className="eyebrow">{current.id} / {current.city} / {current.category}</p><h3>{current.title}</h3><p>{current.note}</p><p><strong>Preview status:</strong> {current.status}</p><label>Decision reason (required)<textarea rows={3} maxLength={140} value={reason} onChange={e => setReason(e.target.value)} placeholder="Example: fictional content reviewed"/></label><div className="admin-decisions"><button type="button" disabled={!reason.trim()} onClick={() => decide("Approved")}>Approve in demo</button><button type="button" disabled={!reason.trim()} onClick={() => decide("Rejected")}>Reject in demo</button></div><p className="admin-hint">Neither action publishes a listing, changes the website, or contacts an advertiser.</p></> : <p>Select a fictional listing.</p>}
      </section>
    </div>
    <section className="admin-history" aria-labelledby="admin-history-title"><h2 id="admin-history-title">Temporary decision history</h2>{history.length ? <ul>{history.map((entry,i) => <li key={i}>{entry}</li>)}</ul> : <p>No decisions made during this preview.</p>}</section>
    <p className="account-return"><Link href="/dashboard">← Dashboard preview</Link></p>
  </section>;
}
