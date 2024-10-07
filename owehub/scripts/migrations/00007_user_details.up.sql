CREATE TABLE IF NOT EXISTS partner_details (
    id BIGINT PRIMARY KEY,
    partner_code VARCHAR(255),
    partner_logo VARCHAR(255),
    bg_colour VARCHAR(255),
    preferred_name VARCHAR(255),
    partner_id BIGINT,
    FOREIGN KEY (partner_id) REFERENCES sales_partner_dbhub_schema(item_id) ON DELETE CASCADE
);

ALTER TABLE user_details
ADD COLUMN partner_id BIGINT;

ALTER TABLE user_details
ADD COLUMN dealer_owner_id BIGINT;


-- Add new foreign key constraints to refer to sales_partner_dbhub_schema.item_id
ALTER TABLE user_details
    ADD CONSTRAINT user_details_dealerowner_fkey
        FOREIGN KEY (dealer_owner_id)
        REFERENCES sales_partner_dbhub_schema(item_id) ON DELETE SET NULL,
    ADD CONSTRAINT user_details_partner_id_fkey
        FOREIGN KEY (partner_id)
        REFERENCES sales_partner_dbhub_schema(item_id) ON DELETE SET NULL;

    
ALTER TABLE user_details
ADD COLUMN podio_user BOOLEAN DEFAULT false;

CREATE OR REPLACE FUNCTION create_new_user(
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
    OUT v_user_id INT
)
RETURNS INT
AS $$
DECLARE
    v_role_id INT;
    v_user_details_id INT;
    v_reporting_manager_id INT;
    v_dealer_owner_id BIGINT;
    v_state_id INT;
    v_zipcode_id INT;
    v_team_id INT;
    v_max_user_code INT;
    v_dealer_id BIGINT;
    v_new_user_code VARCHAR(255);
    v_reporting_manager VARCHAR(255);
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

     -- Get the dealer owner's user_id
    IF p_dealer_name IS NOT NULL AND p_dealer_name != '' THEN
        SELECT item_id INTO v_dealer_id
        FROM sales_partner_dbhub_schema
        WHERE sales_partner_name = p_dealer_name;

        IF NOT FOUND THEN
            RAISE EXCEPTION 'Dealer with name % not found', p_dealer_name;
        END IF;
    ELSE
        v_dealer_id := NULL;
    END IF;

    -- Fetch the maximum user code and increment it
    SELECT MAX(CAST(SUBSTRING(user_code FROM 4) AS INT)) INTO v_max_user_code FROM user_details;
    v_new_user_code := 'OWE' || LPAD(COALESCE(v_max_user_code + 1, 1)::TEXT, 5, '0');

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
        tables_permissions
    )
    VALUES (
        p_name,
        p_db_username,
        v_new_user_code,
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
        v_dealer_id,
	p_add_to_podio,
        p_tables_permissions
    )
    RETURNING user_id INTO v_user_id;

    RAISE NOTICE 'Role Name: %, Dealer Name: %, Dealer Logo: %', p_role_name, p_dealer_name, p_dealer_logo;

    IF p_role_name = 'Dealer Owner' AND p_dealer_name IS NOT NULL AND p_dealer_name != '' AND p_dealer_logo != '' THEN
        UPDATE partner_details
        SET partner_logo = p_dealer_logo
        WHERE id = v_dealer_id;
    END IF;

EXCEPTION
    WHEN unique_violation THEN
        RAISE EXCEPTION 'User with email % or mobile_number % already exists', p_email_id, p_mobile_number;
    WHEN others THEN
        RAISE EXCEPTION 'An error occurred while creating the user: %', SQLERRM;
END;
$$ LANGUAGE plpgsql;


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
    p_preferred_name VARCHAR(255),
    p_tables_permissions jsonb,
    OUT v_user_id INT
)
RETURNS INT 
AS $$
DECLARE
    v_dealer_id BIGINT;
    v_reporting_manager VARCHAR(255);
BEGIN

 -- Get the dealer owner's user_id
    IF p_dealer_name IS NOT NULL AND p_dealer_name != '' THEN
        SELECT item_id INTO v_dealer_id
        FROM sales_partner_dbhub_schema 
        WHERE sales_partner_name = p_dealer_name;

        IF NOT FOUND THEN
            RAISE EXCEPTION 'Dealer with name % not found', p_dealer_name;
        END IF;
    ELSE
        v_dealer_id := NULL;
    END IF;

    UPDATE user_details
    SET 
        name = p_name,
        -- db_username = p_db_username,
        reporting_manager = CASE WHEN p_reporting_manager IS NOT NULL AND p_reporting_manager != '' THEN (SELECT user_id FROM user_details WHERE LOWER(name) = LOWER(p_reporting_manager) LIMIT 1) ELSE NULL END,
        dealer_owner_id = CASE WHEN p_dealer_owner IS NOT NULL AND p_dealer_owner != '' THEN (SELECT user_id FROM user_details WHERE LOWER(name) = LOWER(p_dealer_owner) LIMIT 1) ELSE NULL END,
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
        partner_id = v_dealer_id,
        tables_permissions = p_tables_permissions,
        updated_at = CURRENT_TIMESTAMP
    WHERE user_code = p_user_code
    RETURNING user_id INTO v_user_id;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Record with ID % not found in user_details table', p_record_id;
    END IF;

    IF p_role_name = 'Dealer Owner' AND p_preferred_name IS NOT NULL AND p_preferred_name != '' THEN
        UPDATE partner_details
        SET preferred_name = p_preferred_name
        WHERE id = v_dealer_id;
    END IF;

EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error updating record in user_details: %', SQLERRM;
END;
$$ LANGUAGE plpgsql;

COPY user_details (name,user_code,mobile_number,email_id,password,password_change_required,reporting_manager,partner_id,role_id,user_status,user_designation,description,region,street_address,state,city,zipcode,country,tables_permissions,created_at,updated_at) FROM '/docker-entrypoint-initdb.d/user_details.csv' DELIMITER ',' CSV;