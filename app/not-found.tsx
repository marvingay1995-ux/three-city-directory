import Link from "next/link";
import { DirectoryFooter, DirectoryHeader } from "../components/directory-ui";

export default function NotFound() {
  return (
    <div className="shell">
      <DirectoryHeader />
      <main id="main-content" className="hero" tabIndex={-1}>
        <h1>Page not found</h1>
        <p>Choose Dubai, Muscat, or Doha to browse the demo directory.</p>
        <Link className="text-link" href="/">Choose a city</Link>
      </main>
      <DirectoryFooter />
    </div>
  );
}
