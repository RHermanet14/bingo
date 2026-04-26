DROP TABLE IF EXISTS rooms;
CREATE TABLE rooms (
	id uuid PRIMARY KEY,
	host text,
	type text CHECK (type IN ('Public', 'Private')),
	password text,
	size INT CHECK (size BETWEEN 0 AND 30),
	created_at timestamp default now()
);

create function increment(row_id uuid, amount int)
returns void as $$
  update rooms
  set size = size + amount
  where id = row_id
$$ language sql;