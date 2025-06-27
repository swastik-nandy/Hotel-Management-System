--  Core schema: Booking system (clean final - NO customer FK)

-- Branches
CREATE TABLE IF NOT EXISTS branch (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    state VARCHAR(255) NOT NULL
);

-- Rooms
CREATE TABLE IF NOT EXISTS room (
    id SERIAL PRIMARY KEY,
    room_number VARCHAR(10) NOT NULL,
    room_type VARCHAR(20) NOT NULL,
    branch_id BIGINT NOT NULL,
    CONSTRAINT fk_room_branch FOREIGN KEY (branch_id) REFERENCES branch(id)
);

-- Employees (admin + staff)
CREATE TABLE IF NOT EXISTS employee (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL -- ADMIN, EMPLOYEE
);

-- Bookings
CREATE TABLE IF NOT EXISTS booking (
    id SERIAL PRIMARY KEY,
    booking_id VARCHAR(36) NOT NULL,
    customer_id BIGINT, -- now plain reference, no FK
    customer_name VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    email VARCHAR(255) NOT NULL,
    branch_id BIGINT NOT NULL,
    room_id BIGINT NOT NULL,
    check_in DATE NOT NULL,
    check_out DATE NOT NULL,
    price DOUBLE PRECISION NOT NULL,
    discount DOUBLE PRECISION NOT NULL DEFAULT 0,
    created_at DATE NOT NULL,
    booking_time TIME NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    stripe_session_id VARCHAR(255) UNIQUE, -- ✅ New column for Stripe Webhook Deduplication

    CONSTRAINT fk_booking_branch FOREIGN KEY (branch_id) REFERENCES branch(id),
    CONSTRAINT fk_booking_room FOREIGN KEY (room_id) REFERENCES room(id)
);

-- Initial Branches
INSERT INTO branch (name, state) VALUES
('Kolkata', 'West Bengal'),
('Mumbai', 'Maharashtra');

-- Initial Rooms
INSERT INTO room (room_number, room_type, branch_id) VALUES
('101', 'LUXURY', 1),
('102', 'DELUXE', 1),
('103', 'STANDARD', 1),
('104', 'LUXURY', 1),
('105', 'DELUXE', 1),
('201', 'LUXURY', 2),
('202', 'DELUXE', 2),
('203', 'STANDARD', 2),
('204', 'STANDARD', 2),
('205', 'LUXURY', 2);

-- Optional Admin
INSERT INTO employee (username, password, role) VALUES
('admin', '$2a$10$8X8Z8Z8Z8Z8Z8Z8Z8Z8Z8u8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z8Z', 'ADMIN');
