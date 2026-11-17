import type { Metadata } from "next";
import "./style.css";
export const metadata: Metadata = { title: "Three City Directory — Demo", description: "Demo-only directory for Dubai, Muscat and Doha", robots: { index: false, follow: false } };
export default function RootLayout({ children }: Readonly<{children: React.ReactNode}>) { return <html lang="en"><body><a href="#main-content" className="skip-link">Skip to content</a>{children}</body></html>; }
