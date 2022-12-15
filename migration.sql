DROP TABLE IF EXISTS kitchen;
DROP TABLE IF EXISTS bathroom;

CREATE TABLE kitchen (
  id serial,
  item text,
  count integer
);

CREATE TABLE bathroom (
  id serial,
  item text,
  count integer
);