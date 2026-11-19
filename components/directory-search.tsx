"use client";
import Form from "next/form";
import { useRef } from "react";
import { normalizeSearchQuery, type CategorySlug, type ListingSort } from "../lib/directory";
export function DirectorySearch({ path, query, category, sort }: { path: string; query: string; category?: CategorySlug; sort?: ListingSort; }) {
  const input = useRef<HTMLInputElement>(null);
  return <Form action={path} className="search" onSubmit={() => { if (input.current) input.current.value = normalizeSearchQuery(input.current.value); }}>
    <label htmlFor="q">Search demo listings</label>
    <div className="search-controls">
      <input key={JSON.stringify([path, query, category])} ref={input} id="q" name="q" defaultValue={query} placeholder="Search names, categories, interests…" />
      {category && <input type="hidden" name="category" value={category} />}
      {sort && sort !== "original" && <input type="hidden" name="sort" value={sort} />}
      <button type="submit">Search <span aria-hidden="true">↗</span></button>
    </div>
  </Form>;
}
