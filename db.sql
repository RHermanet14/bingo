DROP TABLE IF EXISTS rooms;
CREATE TABLE rooms (
	id uuid PRIMARY KEY,
	host text,
	type text CHECK (type IN ('Public', 'Private')),
	password text,
	size INT CHECK (size BETWEEN 0 AND 30),
  state text CHECK (state IN ('Pending', 'Started', 'Finished')) default 'Pending',
  settings INT default 111, -- Each digit represents the option number
	created_at timestamp default now()
);

DELETE FROM rooms WHERE state = 'Finished';

-- Supabase enables RLS by default on tables exposed via the API.
-- The app uses the anon key on both client and server, so policies must
-- allow anon to read/create/update rooms.
alter table rooms enable row level security;

drop policy if exists "rooms anon select" on rooms;
create policy "rooms anon select" on rooms
  for select to anon using (true);

drop policy if exists "rooms anon insert" on rooms;
create policy "rooms anon insert" on rooms
  for insert to anon with check (true);

drop policy if exists "rooms anon update" on rooms;
create policy "rooms anon update" on rooms
  for update to anon using (true) with check (true);

drop policy if exists "rooms anon delete" on rooms;
create policy "rooms anon delete" on rooms
  for delete to anon using (true);

CREATE OR REPLACE FUNCTION increment(row_id uuid, amount int)
RETURNS int
LANGUAGE plpgsql AS $$
DECLARE result int;
BEGIN
  UPDATE rooms
  SET size = size + amount
  WHERE id = row_id
  RETURNING size INTO result;
  RETURN result;
END;
$$;