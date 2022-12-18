-- CREATE TABLE items (
--   name TEXT,
--   in_kitchen BOOLEAN,
--   in_bathroom BOOLEAN,
--   kitchen_count INTEGER,
--   bathroom_count INTEGER,
--   total INTEGER GENERATED ALWAYS AS (kitchen_count + bathroom_count) STORED
-- );

INSERT INTO items (name, kitchen, bathroom) VALUES ('sponge', 4, 3);
INSERT INTO items (name, kitchen) VALUES ('spork', 4);
INSERT INTO items (name, kitchen) VALUES ('ajax', 4);