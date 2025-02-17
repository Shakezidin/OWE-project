CREATE TABLE IF NOT EXISTS scheduling_locations (
    address VARCHAR(255) NOT NULL PRIMARY KEY,
    -- latitude NUMERIC(9, 6) NOT NULL,
    -- longitude NUMERIC(9, 6) NOT NULL,
    type VARCHAR(10) NOT NULL,
    CONSTRAINT chk_location_type CHECK (type IN ('homeowner', 'warehouse'))
);

CREATE TABLE IF NOT EXISTS scheduling_projects (
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    email VARCHAR(255) PRIMARY KEY,
    sales_rep_email_id VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    roof_type VARCHAR(50),
    house_stories INT,
    house_area_sqft DOUBLE PRECISION,
    system_size DOUBLE PRECISION,
    is_battery_included BOOLEAN,
    is_appointment_approved BOOLEAN DEFAULT FALSE,
    created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
    site_survey_start_dt timestamp without time zone,
    site_survey_end_dt timestamp without time zone,
    backup_3 TEXT,
    backup_4 TEXT,
    FOREIGN KEY (sales_rep_email_id) REFERENCES user_details(email_id)
);


-- INSERT WAREHOUSE ADDRESSES LOCATIONS
INSERT INTO scheduling_locations (address, type) VALUES ('2798 North 34th Street, Phoenix, AZ, 85008', 'warehouse') ON CONFLICT DO NOTHING;
INSERT INTO scheduling_locations (address, type) VALUES ('6751 W Indian School Rd, Phoenix, AZ 85033', 'warehouse') ON CONFLICT DO NOTHING;
INSERT INTO scheduling_locations (address, type) VALUES ('West Marguerte Avenue, Phoenix, AZ', 'warehouse') ON CONFLICT DO NOTHING;
INSERT INTO scheduling_locations (address, type) VALUES ('15602 N 69th Ave Peoria 85349', 'warehouse') ON CONFLICT DO NOTHING;
INSERT INTO scheduling_locations (address, type) VALUES ('312 South Wayfarer, Mesa, AZ, 85204', 'warehouse') ON CONFLICT DO NOTHING;
INSERT INTO scheduling_locations (address, type) VALUES ('150 e broadway blvd Tucson, AZ', 'warehouse') ON CONFLICT DO NOTHING;
INSERT INTO scheduling_locations (address, type) VALUES ('5437 south mission road Tucson, AZ', 'warehouse') ON CONFLICT DO NOTHING;
INSERT INTO scheduling_locations (address, type) VALUES ('6877 w seahawk way, Tucson AZ', 'warehouse') ON CONFLICT DO NOTHING;
INSERT INTO scheduling_locations (address, type) VALUES ('1889 Palo Verde Boulevard South, Lake Havasu City, AZ, 86403', 'warehouse') ON CONFLICT DO NOTHING;
INSERT INTO scheduling_locations (address, type) VALUES ('California Drive, NE New Kingman-Butler, Mohave County, AZ', 'warehouse') ON CONFLICT DO NOTHING;
INSERT INTO scheduling_locations (address, type) VALUES ('959 Don Felipe Rd Belen NM', 'warehouse') ON CONFLICT DO NOTHING;
INSERT INTO scheduling_locations (address, type) VALUES ('3901 Indian School Rd NE, Albuquerque, NM 87110', 'warehouse') ON CONFLICT DO NOTHING;
INSERT INTO scheduling_locations (address, type) VALUES ('4709 Everett Street, Wheat Ridge, CO, 80033', 'warehouse') ON CONFLICT DO NOTHING;
INSERT INTO scheduling_locations (address, type) VALUES ('5688 Woodmen Ridge View Colorado Springs, CO 80923', 'warehouse') ON CONFLICT DO NOTHING;
INSERT INTO scheduling_locations (address, type) VALUES ('620 Federal Boulevard, Building A, Denver, CO 80204', 'warehouse') ON CONFLICT DO NOTHING;
INSERT INTO scheduling_locations (address, type) VALUES ('3301 Covert Avenue, Fort Worth, TX, 76133', 'warehouse') ON CONFLICT DO NOTHING;
INSERT INTO scheduling_locations (address, type) VALUES ('25139 Buttermilk Ln, San Antonio, TX 78255', 'warehouse') ON CONFLICT DO NOTHING;

