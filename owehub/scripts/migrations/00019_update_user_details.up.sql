CREATE OR REPLACE FUNCTION update_existing_user(
    p_name VARCHAR(255),
    p_db_username VARCHAR(255),
    p_mobile_number VARCHAR(20),
    p_email_id VARCHAR(255),
    p_password VARCHAR(255),
    p_password_change_req BOOLEAN,
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
    p_team_name VARCHAR(255),
    p_dealer_name VARCHAR(255),
    p_dealer_logo VARCHAR(255),
    p_add_to_podio BOOLEAN,
    p_tables_permissions jsonb,
    p_user_code VARCHAR(50),
    p_created_at TIMESTAMP,
    p_manager_role VARCHAR(255),
    OUT v_user_id INT
)
RETURNS INT
AS $$
DECLARE
    v_role_id INT;
    v_user_details_id INT;
    v_reporting_manager_id INT;
    v_dealer_owner_id VARCHAR(255);
    v_state_id INT;
    v_zipcode_id INT;
    v_team_id INT;
    v_max_user_code INT;
    v_partner_id INT;
    v_new_user_code VARCHAR(255);
    v_reporting_manager VARCHAR(255);
    v_phone_number VARCHAR(255);
BEGIN
    -- Get the role_id based on the provided role_name
    IF p_role_name IS NOT NULL THEN
        SELECT role_id INTO v_role_id
        FROM user_roles
        WHERE role_name = p_role_name;

        IF NOT FOUND THEN
            RAISE EXCEPTION 'Invalid Role % not found', p_role_name;
        END IF;
    ELSE
        v_role_id := NULL;
    END IF;

    -- Check if the user with the same email already exists
    IF p_email_id IS NOT NULL THEN
        SELECT user_id INTO v_user_details_id
        FROM user_details
        WHERE email_id = p_email_id;

        IF v_user_details_id IS NOT NULL THEN
            RAISE EXCEPTION 'User with email % already exists', p_email_id;
        END IF;
    END IF;

    -- Check if the user with the same mobile number already exists
    IF p_mobile_number IS NOT NULL THEN
    -- Check if mobile_number already exists in the database
    SELECT mobile_number INTO v_phone_number
    FROM user_details 
    WHERE mobile_number = p_mobile_number;

    IF FOUND THEN
            RAISE EXCEPTION 'PHONE_NO_ALREADY_EXISTS';
        END IF;
    END IF;

    -- Get the reporting manager's user_id
    IF p_reporting_manager IS NOT NULL AND p_reporting_manager != '' THEN
        SELECT user_id INTO v_reporting_manager_id
        FROM user_details
        WHERE user_code = p_reporting_manager;

        IF NOT FOUND THEN
            RAISE EXCEPTION 'Reporting manager with the name % not found', p_reporting_manager;
        END IF;
    ELSE
        v_reporting_manager_id := NULL;
    END IF;

    -- Get the state id
    IF p_state IS NOT NULL AND p_state != '' THEN
        SELECT state_id INTO v_state_id
        FROM states
        WHERE name = p_state;

        IF NOT FOUND THEN
            RAISE EXCEPTION 'State with name % not found', p_state;
        END IF;
    ELSE
        v_state_id := NULL;
    END IF;

    -- Get the zipcode id
    IF p_zipcode IS NOT NULL AND p_zipcode != '' THEN
        SELECT id INTO v_zipcode_id
        FROM zipcodes
        WHERE zipcode = p_zipcode;

        IF NOT FOUND THEN
            RAISE EXCEPTION 'Zipcode with zipcode % not found', p_zipcode;
        END IF;
    ELSE
        v_zipcode_id := NULL;
    END IF;

    -- Get the team_id based on the provided team_name
    IF p_team_name IS NOT NULL AND p_team_name != '' THEN
        SELECT team_id INTO v_team_id
        FROM teams
        WHERE team_name = p_team_name;

        IF NOT FOUND THEN
            RAISE EXCEPTION 'Team with name % not found', p_team_name;
        END IF;
    ELSE
        v_team_id := NULL;
    END IF;

     -- Get the dealer owner's partner_id
    IF p_dealer_name IS NOT NULL AND p_dealer_name != '' THEN
        SELECT partner_id INTO v_partner_id
        FROM sales_partner_dbhub_schema
        WHERE sales_partner_name = p_dealer_name;

        IF NOT FOUND THEN
            RAISE EXCEPTION 'Sales Partner with name % not found', p_dealer_name;
        END IF;
    ELSE
        v_partner_id := NULL;
    END IF;

    -- Insert a new user into user_details table
    INSERT INTO user_details (
        name,
        db_username,
        user_code,
        mobile_number,
        email_id,
        password,
        password_change_required,
        reporting_manager,
        dealer_owner_id,   
        role_id,
        user_status,
        user_designation,
        description,
        region,
        street_address,
        state,
        city,
        zipcode,
        country,
        team_id,
        partner_id,
	    podio_user,
        tables_permissions,
        updated_at,
        created_at,
        manager_role
    )
    VALUES (
        p_name,
        p_db_username,
        p_user_code,
        p_mobile_number,
        p_email_id,
        p_password,
        p_password_change_req,
        v_reporting_manager_id,
        v_dealer_owner_id,
        v_role_id,
        p_user_status,
        p_designation,
        p_description,
        p_region,
        p_street_address,
        v_state_id,
        p_city,
        v_zipcode_id,
        p_country,
        v_team_id,
        v_partner_id,
	    p_add_to_podio,
        p_tables_permissions,
        NOW(),
        p_created_at,
        p_manager_role
    )
    RETURNING user_id INTO v_user_id;

    RAISE NOTICE 'Role Name: %, Dealer Name: %, Dealer Logo: %', p_role_name, p_dealer_name, p_dealer_logo;

  IF p_role_name = 'Dealer Owner' 
   AND p_dealer_name IS NOT NULL 
   AND p_dealer_name != '' 
   AND p_dealer_logo != '' THEN
   
    INSERT INTO partner_details (partner_logo, partner_id)
    VALUES (p_dealer_logo, v_dealer_id);
    
END IF;


EXCEPTION
    WHEN unique_violation THEN
        RAISE EXCEPTION 'User with email % or mobile_number % already exists', p_email_id, p_mobile_number;
    WHEN others THEN
        RAISE EXCEPTION 'An error occurred while creating the user: %', SQLERRM;
END;
$$ LANGUAGE plpgsql;