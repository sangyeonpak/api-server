DROP TABLE IF EXISTS items;

CREATE TABLE items (
  name TEXT UNIQUE,
  kitchen_count INTEGER,
  bathroom_count INTEGER,
  total INTEGER GENERATED ALWAYS AS (kitchen_count + bathroom_count) STORED
);