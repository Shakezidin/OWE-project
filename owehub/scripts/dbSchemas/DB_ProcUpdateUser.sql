CREATE OR REPLACE FUNCTION update_user(
    p_record_id INT,
    p_name VARCHAR(255),
    p_reporting_manager VARCHAR(255),
    p_dealer_owner VARCHAR(255),
    p_role_name VARCHAR(50),
    p_user_status VARCHAR(50),
    p_designation VARCHAR(255),
    p_description VARCHAR(255),
    p_street_address VARCHAR(255),
    p_state VARCHAR(255),
    p_city VARCHAR(255),
    p_zipcode VARCHAR(255),
    p_country VARCHAR(255),
    p_user_code VARCHAR(255),
    OUT v_user_id INT
)
RETURNS INT 
AS $$
BEGIN
    -- Update user details
    UPDATE user_details
    SET 
        name = p_name,
        reporting_manager = CASE WHEN p_reporting_manager IS NOT NULL AND p_reporting_manager != '' THEN (SELECT user_id FROM user_details WHERE LOWER(name) = LOWER(p_reporting_manager) LIMIT 1) ELSE NULL END,
        dealer_owner = CASE WHEN p_dealer_owner IS NOT NULL AND p_dealer_owner != '' THEN (SELECT user_id FROM user_details WHERE LOWER(name) = LOWER(p_dealer_owner) LIMIT 1) ELSE NULL END,
        role_id = CASE WHEN p_role_name IS NOT NULL AND p_role_name != '' THEN (SELECT role_id FROM user_roles WHERE LOWER(role_name) = LOWER(p_role_name) LIMIT 1) ELSE NULL END,
        user_status = COALESCE(NULLIF(p_user_status, ''), NULL),
        user_designation = COALESCE(NULLIF(p_designation, ''), NULL),
        description = COALESCE(NULLIF(p_description, ''), NULL),
        street_address = COALESCE(NULLIF(p_street_address, ''), NULL),
        state = CASE WHEN p_state IS NOT NULL AND p_state != '' THEN (SELECT state_id FROM states WHERE LOWER(name) = LOWER(p_state) LIMIT 1) ELSE NULL END,
        city = COALESCE(NULLIF(p_city, ''), NULL),
        zipcode = CASE WHEN p_zipcode IS NOT NULL AND p_zipcode != '' THEN (SELECT id FROM zipcodes WHERE LOWER(zipcode) = LOWER(p_zipcode) LIMIT 1) ELSE NULL END,
        country = COALESCE(NULLIF(p_country, ''), NULL),
        updated_at = CURRENT_TIMESTAMP
    WHERE user_code = p_user_code
    RETURNING user_id INTO v_user_id;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Record with ID % not found in user_details table', p_record_id;
    END IF;

EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error updating record in user_details: %', SQLERRM;
END;
$$ LANGUAGE plpgsql;
