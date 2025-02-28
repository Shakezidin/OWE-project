/***************************** Dat Tool DB Tables ************************************************/

-- Table for storing project revisions
CREATE TABLE IF NOT EXISTS project2revision (
       id SERIAL PRIMARY KEY,
       project_id VARCHAR(255) NOT NULL,
       revision_id VARCHAR(255) NOT NULL,
       CONSTRAINT unique_project_revision UNIQUE (project_id, revision_id)
);

-- Table for storing project-related data
CREATE TABLE IF NOT EXISTS dat_information (
       id SERIAL PRIMARY KEY,
       project_revision_id INT NOT NULL,
       module_quantity INT,
       design_version INT,
       module_type VARCHAR(255),
       designer_name VARCHAR(255),
       inverter_type VARCHAR(255),
       aurora_id VARCHAR(255),
       battery_type VARCHAR(255),
       --site_capture_url VARCHAR(255), not required now
       system_size_ac DOUBLE PRECISION,
       system_size_dc DOUBLE PRECISION,
       changes_layout TEXT,
       changes_production TEXT,
       changes_order_required TEXT,
       created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
       FOREIGN KEY (project_revision_id) REFERENCES project2revision(id) ON DELETE CASCADE
);

-- Table for different note categories
CREATE TABLE IF NOT EXISTS note_type (
       id SERIAL PRIMARY KEY,
       note_title VARCHAR(255) NOT NULL UNIQUE,
       created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Table for project notes
CREATE TABLE IF NOT EXISTS notes (
       id SERIAL PRIMARY KEY,
       project_revision_id INT NOT NULL,
       note TEXT,
       note_type_id INT NOT NULL,
       created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
       FOREIGN KEY (project_revision_id) REFERENCES project2revision(id) ON DELETE CASCADE,
       FOREIGN KEY (note_type_id) REFERENCES note_type(id) ON DELETE CASCADE
);


-- Table for tracking additional costs (Adders)
CREATE TABLE IF NOT EXISTS adders (
       id SERIAL PRIMARY KEY,
       project_revision_id INT NOT NULL,
       category_name VARCHAR(255) NOT NULL,
       total_cost DOUBLE PRECISION,
       created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
       FOREIGN KEY (project_revision_id) REFERENCES project2revision(id) ON DELETE CASCADE
);

-- Table for tracking adder items
CREATE TABLE IF NOT EXISTS adder_items (
        id SERIAL PRIMARY KEY,
        adder_id INT NOT NULL,
        name VARCHAR(255),
        quantity INT,
        cost_per_unit DOUBLE PRECISION,
        total_cost DOUBLE PRECISION,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (adder_id) REFERENCES adders(id) ON DELETE CASCADE
);

-- Table for PV system interconnections
CREATE TABLE IF NOT EXISTS pv_interconnection (
        id SERIAL PRIMARY KEY,
        project_revision_id INT NOT NULL,
        supply_load_side VARCHAR(255),
        location VARCHAR(255),
        sub_location_tap_details TEXT,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (project_revision_id) REFERENCES project2revision(id) ON DELETE CASCADE
);

-- Table for Energy Storage System (ESS) interconnections
CREATE TABLE IF NOT EXISTS ess_interconnection (
        id SERIAL PRIMARY KEY,
        project_revision_id INT NOT NULL,
        backup_type VARCHAR(255),
        transfer_switch VARCHAR(255),
        fed_by VARCHAR(255),
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (project_revision_id) REFERENCES project2revision(id) ON DELETE CASCADE
);

-- Table for site information
CREATE TABLE IF NOT EXISTS site_info (
        id SERIAL PRIMARY KEY,
        project_revision_id INT NOT NULL,
        drywall_cut_needed BOOLEAN,
        trenching_required BOOLEAN,
        num_of_stories INT,
        pv_conduit_run VARCHAR(255),
        point_of_interconnection INT,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (project_revision_id) REFERENCES project2revision(id) ON DELETE CASCADE
);

-- Table for electrical system information
CREATE TABLE IF NOT EXISTS electrical_system_info (
        id SERIAL PRIMARY KEY,
        project_revision_id INT NOT NULL,
        system_phase VARCHAR(255),
        system_voltage VARCHAR(255),
        service_entrance VARCHAR(255),
        service_rating VARCHAR(255),
        meter_enclosure_type VARCHAR(255),
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (project_revision_id) REFERENCES project2revision(id) ON DELETE CASCADE
);

-- Table for electrical equipment information
CREATE TABLE IF NOT EXISTS electrical_equipment_info (
        id SERIAL PRIMARY KEY,
        project_revision_id INT NOT NULL,
        new_or_existing VARCHAR(255),
        panel_brand VARCHAR(255),
        busbar_rating INT,
        main_breaker_rating INT,
        available_backfeed INT,
        required_backfeed INT,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (project_revision_id) REFERENCES project2revision(id) ON DELETE CASCADE
);

-- Table for roof coverage calculator
CREATE TABLE IF NOT EXISTS roof_coverage_calculator (
        id SERIAL PRIMARY KEY,
        project_revision_id INT NOT NULL,
        total_roof_area VARCHAR(255),
        area_of_new_modules VARCHAR(255),
        area_of_existing_modules VARCHAR(255),
        coverage_percentage VARCHAR(255),
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (project_revision_id) REFERENCES project2revision(id) ON DELETE CASCADE
);

-- Table for measurement conversion
CREATE TABLE IF NOT EXISTS measurement_conversion (
        id SERIAL PRIMARY KEY,
        project_revision_id INT NOT NULL,
        length VARCHAR(255),
        width VARCHAR(255),
        height VARCHAR(255),
        other VARCHAR(255),
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (project_revision_id) REFERENCES project2revision(id) ON DELETE CASCADE
);

-- Table for existing PV system information
CREATE TABLE IF NOT EXISTS existing_pv_system_info (
        id SERIAL PRIMARY KEY,
        project_revision_id INT NOT NULL,
        module_quantity VARCHAR(255),
        model VARCHAR(255),
        wattage VARCHAR(255),
        module_area VARCHAR(255),
        inverter1_id INT,
        inverter2_id INT,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (project_revision_id) REFERENCES project2revision(id) ON DELETE CASCADE
);
