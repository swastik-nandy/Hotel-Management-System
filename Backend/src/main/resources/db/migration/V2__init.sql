CREATE TABLE IF NOT EXISTS prices (
    id SERIAL PRIMARY KEY,
    room_type VARCHAR(50) UNIQUE NOT NULL,
    price_per_night DECIMAL(10, 2) NOT NULL
);


