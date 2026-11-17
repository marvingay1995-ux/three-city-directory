-- PHASE 3 DESIGN-ONLY PostgreSQL DRAFT — NOT EXECUTED.
-- Do not run or provision a database without explicit product-owner approval.
-- This is a sketch, not an approved migration, and carries NO real user data.

CREATE TABLE cities (
  id text PRIMARY KEY, slug text NOT NULL UNIQUE,
  name text NOT NULL, country_code char(2) NOT NULL,
  locale text NOT NULL, currency_code char(3) NOT NULL,
  enabled boolean NOT NULL DEFAULT false
);
CREATE TABLE categories (
  id text PRIMARY KEY, slug text NOT NULL UNIQUE,
  parent_id text REFERENCES categories(id), label text NOT NULL,
  enabled boolean NOT NULL DEFAULT false,
  CHECK (parent_id IS DISTINCT FROM id)
);
CREATE TABLE listings (
  id text PRIMARY KEY, city_id text NOT NULL REFERENCES cities(id),
  category_id text NOT NULL REFERENCES categories(id),
  slug text NOT NULL, title text NOT NULL, description text NOT NULL,
  status text NOT NULL CHECK (status IN ('draft','submitted','under_review','approved','rejected','published','archived')),
  verification_status text NOT NULL CHECK (verification_status IN ('unverified','pending','verified','revoked')),
  sponsored_example boolean NOT NULL DEFAULT false,
  revision integer NOT NULL DEFAULT 0 CHECK (revision >= 0),
  created_at timestamptz NOT NULL, updated_at timestamptz NOT NULL,
  UNIQUE (city_id,slug), CHECK (updated_at >= created_at)
);
CREATE INDEX listings_city_category_status_idx ON listings(city_id,category_id,status);
CREATE TABLE listing_media (
  id text PRIMARY KEY, listing_id text NOT NULL REFERENCES listings(id),
  asset_ref text NOT NULL, rights_status text NOT NULL,
  sort_order integer NOT NULL CHECK (sort_order >= 0)
);
CREATE TABLE submissions (
  id text PRIMARY KEY, listing_id text NOT NULL REFERENCES listings(id),
  actor_ref text NOT NULL, status text NOT NULL, submitted_at timestamptz NOT NULL
);
CREATE TABLE moderation_decisions (
  id text PRIMARY KEY, submission_id text NOT NULL REFERENCES submissions(id),
  actor_ref text NOT NULL, outcome text NOT NULL,
  reason_code text NOT NULL, occurred_at timestamptz NOT NULL
);
CREATE TABLE reports (
  id text PRIMARY KEY, listing_id text NOT NULL REFERENCES listings(id),
  reason_code text NOT NULL, status text NOT NULL, created_at timestamptz NOT NULL
);
CREATE TABLE audit_events (
  id text PRIMARY KEY, actor_ref text NOT NULL, action text NOT NULL,
  target_type text NOT NULL, target_id text NOT NULL, occurred_at timestamptz NOT NULL
);
CREATE INDEX audit_events_target_time_idx ON audit_events(target_type,target_id,occurred_at);
-- Future advertising entities require a separate, approved schema and authorization.
-- Before execution: actor/tenant/city RLS, retention/deletion, PII policies,
-- incident response, data residency, safe migrations and legal review.
