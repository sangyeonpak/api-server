DROP TABLE IF EXISTS items;

CREATE TABLE items (
  name TEXT UNIQUE,
  kitchen INTEGER CHECK (kitchen >= 0) DEFAULT 0,
  bathroom INTEGER CHECK (bathroom >= 0) DEFAULT 0,
  total INTEGER GENERATED ALWAYS AS (kitchen + bathroom) STORED
);