DROP TABLE IF EXISTS rooms;
CREATE TABLE rooms (
	id uuid PRIMARY KEY,
	host text,
	type text CHECK (type IN ('Public', 'Private')),
	password text,
	size INT CHECK (size BETWEEN 0 AND 30),
	created_at timestamp default now()
);

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

create function increment(row_id uuid, amount int)
returns void as $$
  update rooms
  set size = size + amount
  where id = row_id
$$ language sql;