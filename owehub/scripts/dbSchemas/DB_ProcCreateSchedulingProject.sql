CREATE OR REPLACE FUNCTION create_scheduling_project(
    p_first_name VARCHAR,
    p_last_name VARCHAR,
    p_email VARCHAR,
    p_phone VARCHAR,
    p_address TEXT,
    p_roof_type VARCHAR,
    p_house_stories INT,
    p_house_area_sqft DOUBLE PRECISION,
    p_system_size DOUBLE PRECISION,
    p_sales_rep_email_id VARCHAR,
    p_is_battery_included BOOLEAN,
    p_site_survey_start_dt timestamp without time zone DEFAULT NULL,
    p_site_survey_end_dt timestamp without time zone DEFAULT NULL,
    p_backup_3 TEXT DEFAULT NULL,
    p_backup_4 TEXT DEFAULT NULL
)
RETURNS INT
AS $$
BEGIN
    -- Validate that the sales_rep_email_id exists in user_details table
    IF NOT EXISTS (SELECT 1 FROM user_details WHERE email_id = p_sales_rep_email_id) THEN
        RAISE EXCEPTION 'Sales rep email % does not exist in user_details', p_sales_rep_email_id;
    END IF;

    BEGIN
        -- Insert the new record into the scheduling_projects table
        INSERT INTO scheduling_projects (
            first_name, last_name, email, phone, address, roof_type, 
            house_stories, house_area_sqft, system_size, sales_rep_email_id,
            is_battery_included, site_survey_start_dt, site_survey_end_dt, 
            backup_3, backup_4
        ) 
        VALUES (
            p_first_name, p_last_name, p_email, p_phone, p_address, p_roof_type, 
            p_house_stories, p_house_area_sqft, p_system_size, p_sales_rep_email_id,
            p_is_battery_included, p_site_survey_start_dt, p_site_survey_end_dt, 
            p_backup_3, p_backup_4
        );
        
        RETURN 0;

    EXCEPTION
        -- Handle unique constraint violation (e.g., email already exists)
        WHEN unique_violation THEN
            RAISE EXCEPTION 'Project with provided owner email % already exists', p_email;

        -- Handle any other exceptions
        WHEN others THEN
            RAISE EXCEPTION 'An error occurred while creating the project: %', SQLERRM;
    END;
END;
$$ LANGUAGE plpgsql;
