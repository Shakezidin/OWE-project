CREATE OR REPLACE FUNCTION update_profile_function(
    p_street_address VARCHAR(255),
    p_state VARCHAR(255),
    p_city VARCHAR(255),
    p_zipcode VARCHAR(255),
    p_country VARCHAR(255),
    p_email_id VARCHAR(255),
    p_preferred_name VARCHAR(255),
    OUT v_user_id INT
)
AS $$
DECLARE
    v_dealer_id INT;
    v_role_name VARCHAR(255);
BEGIN
    -- Retrieve dealer_id and role_name
    SELECT ud.dealer_id, ur.role_name INTO v_dealer_id, v_role_name
    FROM user_details ud 
    LEFT JOIN user_roles ur ON ud.role_id = ur.role_id
    WHERE ud.email_id = p_email_id;
    
    -- Update user details
    UPDATE user_details
    SET 
        street_address = COALESCE(NULLIF(p_street_address, ''), NULL),
        state = CASE WHEN p_state IS NOT NULL AND p_state != '' THEN (SELECT state_id FROM states WHERE LOWER(name) = LOWER(p_state) LIMIT 1) ELSE NULL END,
        city = COALESCE(NULLIF(p_city, ''), NULL),
        zipcode = CASE WHEN p_zipcode IS NOT NULL AND p_zipcode != '' THEN (SELECT id FROM zipcodes WHERE LOWER(zipcode) = LOWER(p_zipcode) LIMIT 1) ELSE NULL END,
        country = COALESCE(NULLIF(p_country, ''), NULL),
        updated_at = CURRENT_TIMESTAMP
    WHERE email_id = p_email_id
    RETURNING user_id INTO v_user_id;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Record with email % not found in user_details table', p_email_id;
    END IF;

    -- Update preferred_name in v_dealer if role is 'Dealer Owner'
    IF v_role_name = 'Dealer Owner' AND p_preferred_name IS NOT NULL AND p_preferred_name != '' THEN
        UPDATE v_dealer
        SET preferred_name = p_preferred_name
        WHERE id = v_dealer_id;
    END IF;

    RETURN;
EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error updating record in user_details: %', SQLERRM;
END;
$$ LANGUAGE plpgsql;
