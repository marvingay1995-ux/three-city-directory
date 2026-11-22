"use client";
import { useState } from "react";
import Link from "next/link";

type City = "Dubai" | "Muscat" | "Doha";
type Category = "Creative" | "Lifestyle";
type Draft = { title: string; city: City; category: Category; description: string; tagline: string };
const initial: Draft = { title: "Sample Creative Studio", city: "Dubai", category: "Creative", description: "An entirely fictional studio created for interface testing.", tagline: "Ideas after hours." };
export default function ProfileEditorDemo() {
  const [draft, setDraft] = useState<Draft>(initial);
  const [preview, setPreview] = useState(false);
  const [reviewed, setReviewed] = useState(false);
  const update = <K extends keyof Draft>(key: K, value: Draft[K]) => { setDraft(d => ({ ...d, [key]: value })); setReviewed(false); };
  const reset = () => { setDraft(initial); setPreview(false); setReviewed(false); };
  return <section className="profile-editor" aria-labelledby="profile-editor-title">
    <p className="eyebrow">UI-007 / PROFILE EDITOR DEMONSTRATION</p>
    <h1 id="profile-editor-title">Create a fictional profile</h1>
    <p className="dashboard-disclaimer" role="note"><strong>Demo only.</strong> Use invented business details. This page does not save data, upload images, collect contact information, verify identities or publish listings. All changes disappear on reload.</p>
    <div className="profile-editor-actions" aria-label="Editor views">
      <button type="button" aria-pressed={!preview} onClick={() => setPreview(false)}>Edit draft</button>
      <button type="button" aria-pressed={preview} onClick={() => setPreview(true)}>Preview card</button>
      <button type="button" onClick={reset}>Reset example</button>
    </div>
    {preview ? <article className="profile-editor-preview" aria-label="Fictional profile card preview">
      <div className="profile-editor-art" aria-hidden="true"><span>✦</span></div>
      <div className="profile-editor-preview-copy"><p className="eyebrow">{draft.category} / {draft.city}</p><h2>{draft.title || "Untitled example"}</h2><p>{draft.description || "No description yet."}</p><p><em>{draft.tagline}</em></p><span>Fictional draft — not published</span></div>
    </article> :
    <form className="profile-editor-form" onSubmit={event => { event.preventDefault(); setReviewed(true); }}>
      <label>Fictional business name<input required maxLength={60} value={draft.title} onChange={e => update("title", e.target.value)} placeholder="Example business name" /></label>
      <div className="profile-editor-fields">
        <label>City<select value={draft.city} onChange={e => update("city", e.target.value as City)}><option>Dubai</option><option>Muscat</option><option>Doha</option></select></label>
        <label>Category<select value={draft.category} onChange={e => update("category", e.target.value as Category)}><option>Creative</option><option>Lifestyle</option></select></label>
      </div>
      <label>Fictional description<textarea required maxLength={300} rows={4} value={draft.description} onChange={e => update("description", e.target.value)} /></label>
      <label>Editorial tagline<input maxLength={90} value={draft.tagline} onChange={e => update("tagline", e.target.value)} /></label>
      <p className="profile-editor-help">Image upload and publication are unavailable. The preview uses original abstract artwork only.</p>
      <button type="submit">Review fictional draft</button>
      {reviewed && <p role="status" className="profile-editor-reviewed">Draft checked locally. Nothing was submitted or published. Select Preview card to inspect the result.</p>}
    </form>}
    <p className="account-return"><Link href="/dashboard">← Dashboard preview</Link></p>
  </section>;
}
