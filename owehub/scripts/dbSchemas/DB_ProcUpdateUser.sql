CREATE OR REPLACE FUNCTION update_user(
    p_name VARCHAR(255),
    -- p_db_username VARCHAR(255),
    p_reporting_manager VARCHAR(255),
    p_dealer_owner VARCHAR(255),
    p_role_name VARCHAR(50),
    p_user_status VARCHAR(50),
    p_designation VARCHAR(255),
    p_description VARCHAR(255),
    p_region VARCHAR(255),
    p_street_address VARCHAR(255),
    p_state VARCHAR(255),
    p_city VARCHAR(255),
    p_zipcode VARCHAR(255),
    p_country VARCHAR(255),
    p_user_code VARCHAR(255),
    p_dealer_name VARCHAR(255),
    p_tables_permissions jsonb,
    OUT v_user_id INT
)
RETURNS INT 
AS $$
DECLARE
    v_dealer_id INT;
BEGIN

 -- Get the dealer owner's user_id
    IF p_dealer_name IS NOT NULL AND p_dealer_name != '' THEN
        SELECT id INTO v_dealer_id
        FROM v_dealer
        WHERE dealer_name = p_dealer_name;

        IF NOT FOUND THEN
            RAISE EXCEPTION 'Dealer with name % not found', p_dealer_name;
        END IF;
    ELSE
        v_dealer_id := NULL;
    END IF;

    IF p_role_name = 'Regional Manager' AND p_reporting_manager = '' AND p_dealer_owner != '' THEN
    p_reporting_manager = p_dealer_owner
    END IF;

    IF (p_role_name = 'Regional Manager' OR p_role_name = 'Sales Manager' OR p_role_name = 'Sale Representative') AND p_reporting_manager IS NOT NULL AND p_reporting_manager != '' THEN
    SELECT dealer_id INTO v_dealer_id
        FROM user_details
        WHERE name = p_reporting_manager;

        IF NOT FOUND THEN
            RAISE EXCEPTION 'reporting manager with name % not found', p_reporting_manager;
        END IF;
    END IF;
    -- Update user details
    UPDATE user_details
    SET 
        name = p_name,
        -- db_username = p_db_username,
        reporting_manager = CASE WHEN p_reporting_manager IS NOT NULL AND p_reporting_manager != '' THEN (SELECT user_id FROM user_details WHERE LOWER(name) = LOWER(p_reporting_manager) LIMIT 1) ELSE NULL END,
        dealer_owner = CASE WHEN p_dealer_owner IS NOT NULL AND p_dealer_owner != '' THEN (SELECT user_id FROM user_details WHERE LOWER(name) = LOWER(p_dealer_owner) LIMIT 1) ELSE NULL END,
        role_id = CASE WHEN p_role_name IS NOT NULL AND p_role_name != '' THEN (SELECT role_id FROM user_roles WHERE LOWER(role_name) = LOWER(p_role_name) LIMIT 1) ELSE NULL END,
        user_status = COALESCE(NULLIF(p_user_status, ''), NULL),
        user_designation = COALESCE(NULLIF(p_designation, ''), NULL),
        description = COALESCE(NULLIF(p_description, ''), NULL),
        region = COALESCE(NULLIF(p_region, ''), NULL),
        street_address = COALESCE(NULLIF(p_street_address, ''), NULL),
        state = CASE WHEN p_state IS NOT NULL AND p_state != '' THEN (SELECT state_id FROM states WHERE LOWER(name) = LOWER(p_state) LIMIT 1) ELSE NULL END,
        city = COALESCE(NULLIF(p_city, ''), NULL),
        zipcode = CASE WHEN p_zipcode IS NOT NULL AND p_zipcode != '' THEN (SELECT id FROM zipcodes WHERE LOWER(zipcode) = LOWER(p_zipcode) LIMIT 1) ELSE NULL END,
        country = COALESCE(NULLIF(p_country, ''), NULL),
        dealer_id = v_dealer_id,
        tables_permissions = p_tables_permissions,
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
