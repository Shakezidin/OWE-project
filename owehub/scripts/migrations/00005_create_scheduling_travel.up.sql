CREATE TABLE IF NOT EXISTS scheduling_locations (
    address VARCHAR(255) NOT NULL PRIMARY KEY,
    -- latitude NUMERIC(9, 6) NOT NULL,
    -- longitude NUMERIC(9, 6) NOT NULL,
    type VARCHAR(10) NOT NULL,
    CONSTRAINT chk_location_type CHECK (type IN ('homeowner', 'warehouse'))
);

CREATE TABLE IF NOT EXISTS scheduling_routes (
    homeowner_location_address VARCHAR(255) NOT NULL,
    warehouse_location_address VARCHAR(255) NOT NULL,
    distance_meters INT NOT NULL,
    duration VARCHAR(10) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (homeowner_location_address, warehouse_location_address),
    FOREIGN KEY (homeowner_location_address) REFERENCES scheduling_locations(address) ON DELETE CASCADE,
    FOREIGN KEY (warehouse_location_address) REFERENCES scheduling_locations(address) ON DELETE CASCADE
);