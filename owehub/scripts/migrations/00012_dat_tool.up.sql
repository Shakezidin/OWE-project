-- Create the database if it does not exist
CREATE DATABASE IF NOT EXISTS dat_tool_db;

-- Switch to the newly created database
\c dat_tool_db;

/***************************** Dat Tool DB Tables ************************************************/

-- Table for storing project revisions
CREATE TABLE IF NOT EXISTS project2revision (
       id SERIAL PRIMARY KEY,
       project_id VARCHAR NOT NULL,
       revision_id VARCHAR NOT NULL,
       CONSTRAINT unique_project_revision UNIQUE (project_id, revision_id)
);


-- Table for storing project-related data
CREATE TABLE IF NOT EXISTS dat_information (
       id SERIAL PRIMARY KEY,
       project_revision_id INT NOT NULL,
       module_quantity INT,
       design_version INT,
       module_type VARCHAR,
       designer_name VARCHAR,
       inverter_type VARCHAR,
       aurora_id VARCHAR,
       battery_type VARCHAR,
       site_capture_url VARCHAR,
       system_size_ac DOUBLE PRECISION,
       system_size_dc DOUBLE PRECISION,
       changes_layout TEXT,
       changes_production TEXT,
       changes_order_required TEXT,
       created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
       FOREIGN KEY (project_revision_id) REFERENCES project2revision(id) ON DELETE CASCADE
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

-- Table for different note categories
CREATE TABLE IF NOT EXISTS note_type (
       id SERIAL PRIMARY KEY,
       note_title VARCHAR NOT NULL UNIQUE,
       created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP)
    );

-- Table for tracking additional costs (Adders)
CREATE TABLE IF NOT EXISTS adders (
       id SERIAL PRIMARY KEY,
       project_revision_id INT NOT NULL,
       category_name VARCHAR NOT NULL,
       total_cost DOUBLE PRECISION,
       created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
       FOREIGN KEY (project_revision_id) REFERENCES project2revision(id) ON DELETE CASCADE
);

-- Table for tracking adder items
CREATE TABLE IF NOT EXISTS adder_items (
        id SERIAL PRIMARY KEY,
        adder_id INT NOT NULL,
        name VARCHAR,
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
        supply_load_side VARCHAR,
        location VARCHAR,
        sub_location_tap_details TEXT,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (project_revision_id) REFERENCES project2revision(id) ON DELETE CASCADE
);

-- Table for Energy Storage System (ESS) interconnections
CREATE TABLE IF NOT EXISTS ess_interconnection (
        id SERIAL PRIMARY KEY,
        project_revision_id INT NOT NULL,
        backup_type VARCHAR,
        transfer_switch VARCHAR,
        fed_by VARCHAR,
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
        pv_conduit_run VARCHAR,
        point_of_interconnection INT,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (project_revision_id) REFERENCES project2revision(id) ON DELETE CASCADE
);

-- Table for electrical system information
CREATE TABLE IF NOT EXISTS electrical_system_info (
        id SERIAL PRIMARY KEY,
        project_revision_id INT NOT NULL,
        system_phase VARCHAR,
        system_voltage VARCHAR,
        service_entrance VARCHAR,
        service_rating VARCHAR,
        meter_enclosure_type VARCHAR,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (project_revision_id) REFERENCES project2revision(id) ON DELETE CASCADE
);

-- Table for electrical equipment information
CREATE TABLE IF NOT EXISTS electrical_equipment_info (
        id SERIAL PRIMARY KEY,
        project_revision_id INT NOT NULL,
        new_or_existing VARCHAR,
        panel_brand VARCHAR,
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
        total_roof_area VARCHAR,
        area_of_new_modules VARCHAR,
        area_of_existing_modules VARCHAR,
        coverage_percentage VARCHAR,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (project_revision_id) REFERENCES project2revision(id) ON DELETE CASCADE
);

-- Table for measurement conversion
CREATE TABLE IF NOT EXISTS measurement_conversion (
        id SERIAL PRIMARY KEY,
        project_revision_id INT NOT NULL,
        length VARCHAR,
        width VARCHAR,
        height VARCHAR,
        other VARCHAR,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (project_revision_id) REFERENCES project2revision(id) ON DELETE CASCADE
);

-- Table for existing PV system information
CREATE TABLE IF NOT EXISTS existing_pv_system_info (
        id SERIAL PRIMARY KEY,
        project_revision_id INT NOT NULL,
        module_quantity VARCHAR,
        model VARCHAR,
        wattage VARCHAR,
        module_area VARCHAR,
        inverter1_id INT,
        inverter2_id INT,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (project_revision_id) REFERENCES project2revision(id) ON DELETE CASCADE
);

-- Table for inverters
CREATE TABLE IF NOT EXISTS inverter (
        id SERIAL PRIMARY KEY,
        quantity INT,
        model VARCHAR,
        output VARCHAR,
        type INT);

-- Table for structure info plan
CREATE TABLE IF NOT EXISTS structure_info_plan (
        id SERIAL PRIMARY KEY,
        project_revision_id INT,
        plan INT,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (project_revision_id) REFERENCES project2revision(id) ON DELETE CASCADE
);

-- Table for structure info
CREATE TABLE IF NOT EXISTS structure_info (
        id SERIAL PRIMARY KEY,
        plan_id INT,
        structure_attachment_id INT,
        structure_racking_id INT,
        roof_structure_id INT,
        structure INT,
        roof_type VARCHAR,
        roof_material VARCHAR,
        sheathing_type VARCHAR,
        framing_type VARCHAR,
        framing_size VARCHAR,
        framing_spacing VARCHAR,
        structural_upgrades VARCHAR,
        reroof_required BOOLEAN,
        gm_support_type VARCHAR,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (plan_id) REFERENCES structure_info_plan(id) ON DELETE CASCADE,
        FOREIGN KEY (structure_attachment_id) REFERENCES structure_attachment(id) ON DELETE CASCADE,
        FOREIGN KEY (structure_racking_id) REFERENCES structure_racking(id) ON DELETE CASCADE,
        FOREIGN KEY (roof_structure_id) REFERENCES roof_structure(id) ON DELETE CASCADE
);

-- Table for structure racking
CREATE TABLE IF NOT EXISTS structure_racking (
        id SERIAL PRIMARY KEY,
        plan_id INT,
        type VARCHAR,
        mount VARCHAR,
        tilt_info VARCHAR,
        max_rail_cantilever VARCHAR,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (plan_id) REFERENCES structure_info_plan(id) ON DELETE CASCADE
);

-- Table for structure attachment
CREATE TABLE IF NOT EXISTS structure_attachment (
        id SERIAL PRIMARY KEY,
        type VARCHAR,
        pattern VARCHAR,
        quantity VARCHAR,
        spacing VARCHAR,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP);

-- Table for roof structure
CREATE TABLE IF NOT EXISTS roof_structure (
        id SERIAL PRIMARY KEY,
        framing_type VARCHAR,
        size VARCHAR,
        spacing VARCHAR,
        sheathing_type VARCHAR,
        roof_material VARCHAR,
        structural_upgrades VARCHAR,
        created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);