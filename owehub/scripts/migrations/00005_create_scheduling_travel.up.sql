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


-- INSERT WAREHOUSE ADDRESSES LOCATIONS
INSERT INTO scheduling_locations (address, type) VALUES ('2798 North 34th Street, Phoenix, AZ, 85008', 'warehouse');
INSERT INTO scheduling_locations (address, type) VALUES ('6751 W Indian School Rd, Phoenix, AZ 85033', 'warehouse');
INSERT INTO scheduling_locations (address, type) VALUES ('West Marguerte Avenue, Phoenix, AZ', 'warehouse');
INSERT INTO scheduling_locations (address, type) VALUES ('15602 N 69th Ave Peoria 85349', 'warehouse');
INSERT INTO scheduling_locations (address, type) VALUES ('312 South Wayfarer, Mesa, AZ, 85204', 'warehouse');
INSERT INTO scheduling_locations (address, type) VALUES ('150 e broadway blvd Tucson, AZ', 'warehouse');
INSERT INTO scheduling_locations (address, type) VALUES ('5437 south mission road Tucson, AZ', 'warehouse');
INSERT INTO scheduling_locations (address, type) VALUES ('6877 w seahawk way, Tucson AZ', 'warehouse');
INSERT INTO scheduling_locations (address, type) VALUES ('1889 Palo Verde Boulevard South, Lake Havasu City, AZ, 86403', 'warehouse');
INSERT INTO scheduling_locations (address, type) VALUES ('California Drive, NE New Kingman-Butler, Mohave County, AZ', 'warehouse');
INSERT INTO scheduling_locations (address, type) VALUES ('959 Don Felipe Rd Belen NM', 'warehouse');
INSERT INTO scheduling_locations (address, type) VALUES ('3901 Indian School Rd NE, Albuquerque, NM 87110', 'warehouse');
INSERT INTO scheduling_locations (address, type) VALUES ('4709 Everett Street, Wheat Ridge, CO, 80033', 'warehouse');
INSERT INTO scheduling_locations (address, type) VALUES ('5688 Woodmen Ridge View Colorado Springs, CO 80923', 'warehouse');
INSERT INTO scheduling_locations (address, type) VALUES ('620 Federal Boulevard, Building A, Denver, CO 80204', 'warehouse');
INSERT INTO scheduling_locations (address, type) VALUES ('3301 Covert Avenue, Fort Worth, TX, 76133', 'warehouse');
INSERT INTO scheduling_locations (address, type) VALUES ('25139 Buttermilk Ln, San Antonio, TX 78255', 'warehouse');