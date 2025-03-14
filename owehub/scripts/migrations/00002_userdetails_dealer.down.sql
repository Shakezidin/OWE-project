-- Remove the unique constraints from `dealer_code` and `dealer_name`
ALTER TABLE v_dealer
    DROP CONSTRAINT unique_dealer_code,
    DROP CONSTRAINT unique_dealer_name;

-- Rename the column `is_deleted` back to `is_active`
ALTER TABLE v_dealer
    RENAME COLUMN is_deleted TO is_active;

-- Revert the `update_profile_function` to its original state without the `dealer_code` parameter
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
        SET 
            preferred_name = p_preferred_name
        WHERE id = v_dealer_id;
    END IF;

    RETURN;
EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error updating record in user_details: %', SQLERRM;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION create_v_dealer(
    p_dealer_code VARCHAR,
    p_dealer_name VARCHAR,
    p_description VARCHAR,
    p_dealer_logo VARCHAR,
    p_bg_colour VARCHAR,
    p_preferred_name VARCHAR,
    OUT v_dealer_id INT
)
RETURNS INT
AS $$
BEGIN
    -- Insert a new v_dealer into v_dealers table
    INSERT INTO v_dealer (
        dealer_code,
        dealer_name,
        description,
        dealer_logo,
        bg_colour,
        preferred_name,
        is_active
    )
    VALUES (
        p_dealer_code,
        p_dealer_name,
        p_description,
        p_dealer_logo,
        p_bg_colour,
        p_preferred_name,
        FALSE
    )
    RETURNING id INTO v_dealer_id;

END;
$$ LANGUAGE plpgsql;


-- Drop the `update_v_dealer_archive` function
CREATE OR REPLACE FUNCTION update_v_dealer_archive(
    p_ids BIGINT[],
    p_is_active BOOLEAN,
    OUT v_dealer_id BIGINT
)
AS $$
DECLARE
    v_dealers_id BIGINT;
BEGIN
    FOR v_dealers_id IN SELECT unnest(p_ids)
    LOOP
        UPDATE v_dealer vd
        SET
            is_active = p_is_active,
            updated_at = CURRENT_TIMESTAMP
        WHERE vd.id = v_dealers_id;

        IF NOT FOUND THEN
            RAISE EXCEPTION 'Record with ID % not found in v_dealer table', v_dealers_id;
        END IF;

        -- Assign the last processed dealer ID to the OUT parameter
        v_dealer_id := v_dealers_id;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION update_v_dealer_archive(
    p_ids BIGINT[],
    p_is_active BOOLEAN,
    OUT v_dealer_id BIGINT
)
AS $$
DECLARE
    v_dealers_id BIGINT;
BEGIN
    FOR v_dealers_id IN SELECT unnest(p_ids)
    LOOP
        UPDATE v_dealer vd
        SET
            is_active = p_is_active,
            updated_at = CURRENT_TIMESTAMP
        WHERE vd.id = v_dealers_id;

        IF NOT FOUND THEN
            RAISE EXCEPTION 'Record with ID % not found in v_dealer table', v_dealers_id;
        END IF;
        
        -- Assign the last processed dealer ID to the OUT parameter
        v_dealer_id := v_dealers_id;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

ALTER TABLE v_dealer
    ADD CONSTRAINT unique_dealer_code UNIQUE (dealer_code),
    ADD CONSTRAINT unique_dealer_name UNIQUE (dealer_name);

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
    p_tables_permissions jsonb,
    OUT v_user_id INT
)
RETURNS INT
AS $$
DECLARE
    v_role_id INT;
    v_user_details_id INT;
    v_reporting_manager_id INT;
    v_dealer_owner_id INT;
    v_state_id INT;
    v_zipcode_id INT;
    v_team_id INT;
    v_max_user_code INT;
    v_dealer_id INT;
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
        SELECT id INTO v_dealer_id
        FROM v_dealer
        WHERE dealer_code = p_dealer_name;

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
        dealer_owner,   
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
        dealer_id,
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
        p_tables_permissions
    )
    RETURNING user_id INTO v_user_id;

    IF p_role_name = 'Dealer Owner' AND p_dealer_name IS NOT NULL AND p_dealer_name != '' AND p_dealer_logo != '' THEN
        UPDATE v_dealer
        SET dealer_logo = p_dealer_logo
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
    v_dealer_id INT;
    v_reporting_manager VARCHAR(255);
BEGIN

 -- Get the dealer owner's user_id
    IF p_dealer_name IS NOT NULL AND p_dealer_name != '' THEN
        SELECT id INTO v_dealer_id
        FROM v_dealer
        WHERE dealer_code = p_dealer_name;

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

    IF p_role_name = 'Dealer Owner' AND p_preferred_name IS NOT NULL AND p_preferred_name != '' THEN
        UPDATE v_dealer
        SET preferred_name = p_preferred_name
        WHERE id = v_dealer_id;
    END IF;

EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error updating record in user_details: %', SQLERRM;
END;
$$ LANGUAGE plpgsql;

ALTER TABLE user_details
DROP COLUMN podio_user;

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
    p_tables_permissions jsonb,
    OUT v_user_id INT
)
RETURNS INT
AS $$
DECLARE
    v_role_id INT;
    v_user_details_id INT;
    v_reporting_manager_id INT;
    v_dealer_owner_id INT;
    v_state_id INT;
    v_zipcode_id INT;
    v_team_id INT;
    v_max_user_code INT;
    v_dealer_id INT;
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
        SELECT id INTO v_dealer_id
        FROM v_dealer
        WHERE dealer_name = p_dealer_name;

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
        dealer_owner,   
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
        dealer_id,
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
        p_tables_permissions
    )
    RETURNING user_id INTO v_user_id;

    IF p_role_name = 'Dealer Owner' AND p_dealer_name IS NOT NULL AND p_dealer_name != '' AND p_dealer_logo != '' THEN
        UPDATE v_dealer
        SET dealer_logo = p_dealer_logo
        WHERE id = v_dealer_id;
    END IF;

EXCEPTION
    WHEN unique_violation THEN
        RAISE EXCEPTION 'User with email % or mobile_number % already exists', p_email_id, p_mobile_number;
    WHEN others THEN
        RAISE EXCEPTION 'An error occurred while creating the user: %', SQLERRM;
END;
$$ LANGUAGE plpgsql;

-- ALTER TABLE user_details
--     DROP CONSTRAINT IF EXISTS user_details_dealerowner_fkey,
--     DROP CONSTRAINT IF EXISTS user_details_partner_id_fkey;

-- Drop the columns that were added
ALTER TABLE user_details
    DROP COLUMN IF EXISTS partner_id,
    DROP COLUMN IF EXISTS dealer_owner_id;

-- Optionally, drop the partner_details table (if created as part of the "up" migration)
DROP TABLE IF EXISTS partner_details;


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
    v_dealer_owner_id INT;
    v_state_id INT;
    v_zipcode_id INT;
    v_team_id INT;
    v_max_user_code INT;
    v_dealer_id INT;
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
        SELECT id INTO v_dealer_id
        FROM v_dealer
        WHERE dealer_name = p_dealer_name;

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
        dealer_owner,   
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
        dealer_id,
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

    IF p_role_name = 'Dealer Owner' AND p_dealer_name IS NOT NULL AND p_dealer_name != '' AND p_dealer_logo != '' THEN
        UPDATE v_dealer
        SET dealer_logo = p_dealer_logo
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
        SELECT id INTO v_dealer_id
        FROM v_dealer 
        WHERE dealer_name = p_dealer_name;

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
         = v_dealer_id,
        tables_permissions = p_tables_permissions,
        updated_at = CURRENT_TIMESTAMP
    WHERE user_code = p_user_code
    RETURNING user_id INTO v_user_id;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Record with ID % not found in user_details table', p_record_id;
    END IF;

    IF p_role_name = 'Dealer Owner' AND p_preferred_name IS NOT NULL AND p_preferred_name != '' THEN
        UPDATE v_dealer
        SET preferred_name = p_preferred_name
        WHERE id = v_dealer_id;
    END IF;

EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error updating record in user_details: %', SQLERRM;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.update_v_dealer(p_id integer, p_dealer_code character varying, p_dealer_name character varying, p_description character varying, p_dealer_logo character varying, p_bg_colour character varying, p_preferred_name character varying, OUT v_dealer_id integer)
 RETURNS integer
 LANGUAGE plpgsql
AS $function$
BEGIN
    UPDATE v_dealer
    SET 
	        dealer_code = p_dealer_code,
	        dealer_name = p_dealer_name,
	        description = p_description,
	        dealer_logo = p_dealer_logo,
	        bg_colour = p_bg_colour,
	        preferred_name = p_preferred_name,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = p_id
    RETURNING id INTO v_dealer_id;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Record with ID % not found in v_dealer table', p_id;
    END IF;
    -- No need for a RETURN statement when using OUT parameters
EXCEPTION
    WHEN OTHERS THEN
        -- Handle the exception, you can log or re-raise as needed
        RAISE EXCEPTION 'Error updating record in v_dealers: %', SQLERRM;
END;
$function$
;

DROP FUNCTION update_existing_user;

ALTER TABLE user_details DROP COLUMN manager_role;
