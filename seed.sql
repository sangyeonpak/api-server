-- CREATE TABLE items (
--   name TEXT,
--   in_kitchen BOOLEAN,
--   in_bathroom BOOLEAN,
--   kitchen_count INTEGER,
--   bathroom_count INTEGER,
--   total INTEGER GENERATED ALWAYS AS (kitchen_count + bathroom_count) STORED
-- );

INSERT INTO items (name, kitchen_count, bathroom_count) VALUES ('sponge', 0, 4);
INSERT INTO items (name, kitchen_count, 0) VALUES ('spork', 4);
