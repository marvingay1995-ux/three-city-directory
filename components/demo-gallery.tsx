"use client";

import { useId, useRef, useState, type KeyboardEvent } from "react";

const frames = [
  { key: "overview", label: "Overview image placeholder", symbol: "✳", caption: "Editorial concept / Overview", number: "01", detail: "Composition and atmosphere" },
  { key: "detail", label: "Detail image placeholder", symbol: "◈", caption: "Editorial concept / Detail", number: "02", detail: "Form and texture" },
] as const;

type FrameKey = (typeof frames)[number]["key"];
type Theme = "copper" | "plum" | "sand" | "olive" | "rose" | "indigo";

export function DemoGallery({ title, theme = "copper" }: { title: string; theme?: Theme }) {
  const [active, setActive] = useState<FrameKey>("overview");
  const tabId = useId();
  const picker = useRef<Array<HTMLButtonElement | null>>([]);
  const index = frames.findIndex((frame) => frame.key === active);
  const chosen = frames[index] ?? frames[0];

  function switchTo(nextIndex: number, focus = false) {
    const next = (nextIndex + frames.length) % frames.length;
    setActive(frames[next].key);
    if (focus) picker.current[next]?.focus();
  }

  function onPickerKeyDown(event: KeyboardEvent<HTMLButtonElement>, frameIndex: number) {
    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      event.preventDefault();
      switchTo(frameIndex + 1, true);
    } else if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      event.preventDefault();
      switchTo(frameIndex - 1, true);
    } else if (event.key === "Home") {
      event.preventDefault();
      switchTo(0, true);
    } else if (event.key === "End") {
      event.preventDefault();
      switchTo(frames.length - 1, true);
    }
  }

  return (
    <div className="demo-gallery">
      <div className={`demo-gallery-stage gallery-${chosen.key} editorial-${theme}`} role="img"
        aria-label={`${title}: ${chosen.label}. This is decorative artwork, not a photograph.`}>
        <div className="gallery-composition" aria-hidden="true"><span className="gallery-composition-disc" /><span className="gallery-composition-line" /><span className="demo-gallery-symbol">{chosen.symbol}</span></div>
        <span className="demo-gallery-stamp">FICTIONAL / CONCEPT ONLY</span>
        <span className="gallery-frame-count" aria-hidden="true">{chosen.number} <span>/ 02</span></span>
        <div className="demo-gallery-caption"><span>{chosen.detail.toUpperCase()}</span><strong>{chosen.caption}</strong></div>
      </div>
      <div className="gallery-navigation" aria-label="Gallery navigation">
        <span className="gallery-navigation-caption">CONCEPT STUDY <span aria-hidden="true">/</span> TWO EDITORIAL VIEWS</span>
        <div className="gallery-nav-buttons">
          <button type="button" className="gallery-nav-button" onClick={() => switchTo(index - 1)}
            aria-label={`Previous fictional gallery view for ${title}`}><span aria-hidden="true">←</span></button>
          <span className="gallery-position" aria-live="polite" aria-atomic="true">{chosen.number} / 02</span>
          <button type="button" className="gallery-nav-button" onClick={() => switchTo(index + 1)}
            aria-label={`Next fictional gallery view for ${title}`}><span aria-hidden="true">→</span></button>
        </div>
      </div>
      <div className="demo-gallery-picker" role="group" aria-label="Choose a fictional gallery view">
        {frames.map((frame, frameIndex) => (
          <button ref={(node) => { picker.current[frameIndex] = node; }}
            type="button" id={`${tabId}-view-${frame.key}`} key={frame.key}
            className={`demo-gallery-thumb gallery-${frame.key}`}
            aria-pressed={active === frame.key} onKeyDown={(event) => onPickerKeyDown(event, frameIndex)}
            onClick={() => switchTo(frameIndex)}>
            <span className="demo-gallery-thumb-art" aria-hidden="true">{frame.symbol}</span>
            <span><small>{frame.number} / STUDY</small>{frame.label}</span>
          </button>
        ))}
      </div>
      <p className="demo-gallery-note">Two interactive artwork placeholders. No real images, individuals or services are represented. Use the arrow buttons, thumbnail controls, or arrow keys while focused on a thumbnail to explore.</p>
    </div>
  );
}
