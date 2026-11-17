"use client";

import Form from "next/form";
import { useRef } from "react";
import { normalizeSearchQuery, type CategorySlug } from "../lib/directory";

export function DirectorySearch({ path, query, category }: {
  path: string;
  query: string;
  category?: CategorySlug;
}) {
  const input = useRef<HTMLInputElement>(null);

  return (
    <Form action={path} className="search" onSubmit={() => {
      if (input.current) input.current.value = normalizeSearchQuery(input.current.value);
    }}>
      <label htmlFor="q">Search demo listings</label>
      <div className="search-controls">
        <input
          key={JSON.stringify([path, query, category])}
          ref={input}
          id="q"
          name="q"
          defaultValue={query}
          placeholder="Name or category"
        />
        {category && <input type="hidden" name="category" value={category} />}
        <button type="submit">Search</button>
      </div>
    </Form>
  );
}
