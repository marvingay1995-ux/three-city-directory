"use client";

import Link from "next/link";
import { DirectoryFooter, DirectoryHeader } from "../../components/directory-ui";

export default function DirectoryError({ reset }: { reset: () => void }) {
  return (
    <div className="shell">
      <DirectoryHeader />
      <main id="main-content" className="hero" tabIndex={-1}>
        <div role="alert">
          <h1>Directory unavailable</h1>
          <p>Something went wrong while loading the listings.</p>
        </div>
        <div className="error-actions">
          <button type="button" onClick={reset}>Try again</button>
          <Link className="text-link" href="/">Choose a city</Link>
        </div>
      </main>
      <DirectoryFooter />
    </div>
  );
}
