"use client";
import { useState } from "react";
import Link from "next/link";

type Mode = "register" | "login" | "recover";
type Role = "visitor" | "advertiser";
export default function AccountDemo() {
  const [mode, setMode] = useState<Mode>("register");
  const [role, setRole] = useState<Role>("visitor");
  const [submitted, setSubmitted] = useState(false);
  const change = (next: Mode) => { setMode(next); setSubmitted(false); };
  return <section className="account-demo" aria-labelledby="account-title">
    <p className="eyebrow">UI-005 / INTERACTIVE PROTOTYPE</p>
    <h1 id="account-title">{mode === "register" ? "Create an account" : mode === "login" ? "Sign in" : "Recover access"}</h1>
    <p className="account-warning" role="note"><strong>Demonstration only.</strong> No accounts are created, passwords are checked, emails are sent, or information is saved. Do not enter real credentials.</p>
    <div className="account-tabs" aria-label="Account options">
      <button type="button" aria-pressed={mode === "register"} onClick={() => change("register")}>Register</button>
      <button type="button" aria-pressed={mode === "login"} onClick={() => change("login")}>Sign in</button>
    </div>
    {submitted ? <div className="account-success" role="status"><h2>Prototype interaction complete</h2><p>This is a design demonstration. No account or session exists.</p><Link href="/dashboard" className="account-header-link">Explore dashboard preview →</Link><button type="button" onClick={() => setSubmitted(false)}>Return to form</button></div> :
    <form className="account-form" onSubmit={e => { e.preventDefault(); setSubmitted(true); }}>
      {mode === "register" && <fieldset><legend>Choose a demonstration role</legend><label><input type="radio" name="role" checked={role === "visitor"} onChange={() => setRole("visitor")}/> Visitor</label><label><input type="radio" name="role" checked={role === "advertiser"} onChange={() => setRole("advertiser")}/> Advertiser (preview only)</label></fieldset>}
      {mode === "register" && <label>Display name<input required maxLength={60} autoComplete="off" placeholder="Example User" /></label>}
      <label>Email (use a fictional example)<input required type="email" autoComplete="off" placeholder="demo@example.com"/></label>
      {mode !== "recover" && <label>Password (fictional only)<input required type="password" autoComplete="off" minLength={8} placeholder="Use a made-up password"/></label>}
      <button type="submit">{mode === "recover" ? "Preview recovery" : mode === "login" ? "Preview sign in" : "Preview registration"}</button>
      {mode === "login" && <button type="button" className="account-text-action" onClick={() => change("recover")}>Forgot password?</button>}
      {mode === "recover" && <button type="button" className="account-text-action" onClick={() => change("login")}>Back to sign in</button>}
    </form>}
    <p className="account-return"><Link href="/">← Back to directory</Link></p>
  </section>;
}
