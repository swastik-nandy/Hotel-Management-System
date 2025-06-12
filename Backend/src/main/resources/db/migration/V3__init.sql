INSERT INTO prices (room_type, price_per_night) VALUES
  ('Standard', 2500.00),
  ('Deluxe', 3500.00),
  ('Luxury', 5000.00)
ON CONFLICT (room_type) DO NOTHING;
