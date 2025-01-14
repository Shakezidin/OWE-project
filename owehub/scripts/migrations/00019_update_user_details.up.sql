CREATE OR REPLACE FUNCTION update_user(
    p_name VARCHAR(255),
    p_mobile_number VARCHAR(20),
    p_email_id VARCHAR(255),
    p_password_change_req BOOLEAN,
    p_reporting_manager VARCHAR(255),
    p_dealer_owner VARCHAR(255),
    p_role_name VARCHAR(50),
    p_user_status VARCHAR(50),
    p_designation VARCHAR(255),
    p_description VARCHAR(501),
    p_region VARCHAR(255),
    p_street_address VARCHAR(255),
    p_state VARCHAR(255),
    p_city VARCHAR(50),
    p_zipcode VARCHAR(255),
    p_country VARCHAR(50),
    p_user_code VARCHAR(255),
    p_dealer VARCHAR(255),
    p_tables_permissions jsonb,
    OUT v_user_id INT
)
RETURNS INT
AS $$
DECLARE
    v_dealer_id INT;
    v_state_id INT;
    v_zipcode_id INT;
BEGIN
    -- Get dealer ID if dealer is provided
    IF p_dealer IS NOT NULL AND p_dealer != '' THEN
        SELECT id INTO v_dealer_id
        FROM v_dealer
        WHERE dealer_code = p_dealer;
        IF NOT FOUND THEN
            RAISE EXCEPTION 'Dealer with code % not found', p_dealer;
        END IF;
    END IF;

    -- Get state ID if state is provided
    IF p_state IS NOT NULL AND p_state != '' THEN
        SELECT state_id INTO v_state_id
        FROM states
        WHERE LOWER(name) = LOWER(p_state);
        IF NOT FOUND THEN
            RAISE EXCEPTION 'State % not found', p_state;
        END IF;
    END IF;

    -- Get zipcode ID if zipcode is provided
    IF p_zipcode IS NOT NULL AND p_zipcode != '' THEN
        SELECT id INTO v_zipcode_id
        FROM zipcodes
        WHERE zipcode = p_zipcode;
        IF NOT FOUND THEN
            RAISE EXCEPTION 'Zipcode % not found', p_zipcode;
        END IF;
    END IF;

    -- Update user details
    UPDATE user_details
    SET
        name = COALESCE(NULLIF(p_name, ''), name),
        mobile_number = COALESCE(NULLIF(p_mobile_number, ''), mobile_number),
        password_change_required = COALESCE(p_password_change_req, password_change_required),
        reporting_manager = CASE 
            WHEN p_reporting_manager IS NOT NULL AND p_reporting_manager != '' 
            THEN (SELECT user_id FROM user_details WHERE LOWER(name) = LOWER(p_reporting_manager) LIMIT 1) 
            ELSE reporting_manager 
        END,
        dealer_owner = CASE 
            WHEN p_dealer_owner IS NOT NULL AND p_dealer_owner != '' 
            THEN (SELECT partner_id FROM sales_partner_dbhub_schema WHERE LOWER(sales_partner_name) = LOWER(p_dealer_owner) LIMIT 1) 
            ELSE dealer_owner 
        END,
        role_id = CASE 
            WHEN p_role_name IS NOT NULL AND p_role_name != '' 
            THEN (SELECT role_id FROM user_roles WHERE LOWER(role_name) = LOWER(p_role_name) LIMIT 1) 
            ELSE role_id 
        END,
        user_status = COALESCE(NULLIF(p_user_status, ''), user_status),
        user_designation = COALESCE(NULLIF(p_designation, ''), user_designation),
        description = COALESCE(NULLIF(p_description, ''), description),
        region = COALESCE(NULLIF(p_region, ''), region),
        street_address = COALESCE(NULLIF(p_street_address, ''), street_address),
        state = COALESCE(v_state_id, state),
        city = COALESCE(NULLIF(p_city, ''), city),
        zipcode = COALESCE(v_zipcode_id, zipcode),
        country = COALESCE(NULLIF(p_country, ''), country),
        user_code = COALESCE(NULLIF(p_user_code, ''), user_code),
        dealer_id = COALESCE(v_dealer_id, dealer_id),
        tables_permissions = COALESCE(p_tables_permissions, tables_permissions),
        updated_at = CURRENT_TIMESTAMP
    WHERE email_id = p_email_id
    RETURNING user_id INTO v_user_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'User with email % not found', p_email_id;
    END IF;

    -- Update dealer preferred name if role is Dealer Owner
    IF p_role_name = 'Dealer Owner' AND v_dealer_id IS NOT NULL THEN
        UPDATE v_dealer
        SET preferred_name = p_name
        WHERE id = v_dealer_id;
    END IF;

    RETURN;

EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error updating user: %', SQLERRM;
END;
$$ LANGUAGE plpgsql;