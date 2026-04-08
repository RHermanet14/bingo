DROP TABLE IF EXISTS rooms;
CREATE TABLE rooms (
	id uuid PRIMARY KEY,
	host text,
	type text,
    CONSTRAINT isValidType CHECK (type IN ('Public', 'Private')),
	created_at timestamp default now()
);