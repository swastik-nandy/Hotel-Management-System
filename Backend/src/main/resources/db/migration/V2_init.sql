CREATE TABLE IF NOT EXISTS prices (
    id SERIAL PRIMARY KEY,
    room_type VARCHAR(50) UNIQUE NOT NULL,
    price_per_night DECIMAL(10, 2) NOT NULL
);

INSERT INTO prices (room_type, price_per_night) VALUES 
('STANDARD', 2500.00),
('DELUXE', 3500.00),
('LUXURY', 5000.00);

