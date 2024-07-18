CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE INDEX IF NOT EXISTS products_attributes_idx ON products USING gin (attributes);
CREATE INDEX IF NOT EXISTS products_name_trgm_idx ON products USING gin (title gin_trgm_ops);
