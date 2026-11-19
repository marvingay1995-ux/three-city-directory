"use client";

import { useState } from "react";

const frames = [
  { key: "overview", label: "Overview image placeholder", symbol: "✳", caption: "Editorial concept / Overview" },
  { key: "detail", label: "Detail image placeholder", symbol: "◈", caption: "Editorial concept / Detail" },
] as const;

export function DemoGallery({ title }: { title: string }) {
  const [active, setActive] = useState<(typeof frames)[number]["key"]>("overview");
  const chosen = frames.find((frame) => frame.key === active) ?? frames[0];

  return (
    <div className="demo-gallery">
      <div className={`demo-gallery-stage gallery-${chosen.key}`} role="img" aria-label={`${title}: ${chosen.label}. This is decorative artwork, not a photograph.`}>
        <span className="demo-gallery-symbol" aria-hidden="true">{chosen.symbol}</span>
        <span className="demo-gallery-stamp">FICTIONAL / CONCEPT ONLY</span>
        <div className="demo-gallery-caption"><span>01 / EDITORIAL VIEW</span><strong>{chosen.caption}</strong></div>
      </div>
      <div className="demo-gallery-picker" role="group" aria-label="Choose a fictional gallery view">
        {frames.map((frame, index) => (
          <button type="button" key={frame.key} className={`demo-gallery-thumb gallery-${frame.key}`} aria-pressed={active === frame.key} onClick={() => setActive(frame.key)}>
            <span className="demo-gallery-thumb-art" aria-hidden="true">{frame.symbol}</span>
            <span><small>0{index + 1}</small>{frame.label}</span>
          </button>
        ))}
      </div>
      <p className="demo-gallery-note">Two interactive artwork placeholders. No real images, individuals or services are represented.</p>
    </div>
  );
}
