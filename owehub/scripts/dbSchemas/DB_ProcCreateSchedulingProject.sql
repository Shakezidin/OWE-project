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
    p_sales_rep_email_id VARCHAR
)
RETURNS INT
AS $$
BEGIN
    -- Insert the new record into the scheduling_projects table
    INSERT INTO scheduling_projects (
        first_name, last_name, email, phone, address, roof_type, 
        house_stories, house_area_sqft, system_size, sales_rep_email_id
    ) 
    VALUES (
        p_first_name, p_last_name, p_email, p_phone, p_address, p_roof_type, 
        p_house_stories, p_house_area_sqft, p_system_size, p_sales_rep_email_id
    );

    RETURN 0;
END;
$$ LANGUAGE plpgsql;
