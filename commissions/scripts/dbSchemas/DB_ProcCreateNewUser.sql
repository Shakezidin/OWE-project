CREATE OR REPLACE FUNCTION create_new_user(
    p_name VARCHAR(255),
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
    p_street_address VARCHAR(255),
    p_state VARCHAR(255),
    p_city VARCHAR(255),
    p_zipcode VARCHAR(255),
    p_country VARCHAR(255),
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
    v_max_user_code INT;
    v_new_user_code VARCHAR(255);
BEGIN
    -- Get the role_id based on the provided role_name
    IF p_role_name IS NOT NULL THEN
        SELECT role_id INTO v_role_id
        FROM user_roles
        WHERE role_name = p_role_name;

        -- Check if the role exists
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

    -- Get the reporting manager's user_id based on the provided email
    IF p_reporting_manager IS NOT NULL THEN
        SELECT user_id INTO v_reporting_manager_id
        FROM user_details
        WHERE name = p_reporting_manager;

        IF NOT FOUND THEN
            RAISE EXCEPTION 'Reporting manager with name % not found', p_reporting_manager;
        END IF;
    ELSE
        v_reporting_manager_id := NULL;
    END IF;

    -- Get the dealer owner's user_id based on the provided email
    IF p_dealer_owner IS NOT NULL THEN
        SELECT user_id INTO v_dealer_owner_id
        FROM user_details
        WHERE name = p_dealer_owner;

        IF NOT FOUND THEN
            RAISE EXCEPTION 'Dealer owner with name % not found', p_dealer_owner;
        END IF;
    ELSE
        v_dealer_owner_id := NULL;
    END IF;

    -- Get the state id based on the provided state name
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

    -- Get the state id based on the provided state name
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

    -- Fetch the maximum user code and increment it
    SELECT MAX(CAST(SUBSTRING(user_code FROM 4) AS INT)) INTO v_max_user_code FROM user_details;
    v_new_user_code := 'OUR' || LPAD(COALESCE(v_max_user_code + 1, 1)::TEXT, 5, '0');


    BEGIN
        -- Insert a new user into user_details table
        INSERT INTO user_details (
            name,
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
            street_address,
            state,
            city,
            zipcode,
            country
        )
        VALUES (
            p_name,
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
            p_street_address,
            v_state_id,
            p_city,
            v_zipcode_id,
            p_country
        )
        RETURNING user_id INTO v_user_id;

    EXCEPTION
        WHEN unique_violation THEN
            RAISE EXCEPTION 'User with email % already exists', p_email_id;
        WHEN others THEN
            RAISE EXCEPTION 'An error occurred while creating the user: %', SQLERRM;
    END;

END;
$$ LANGUAGE plpgsql;
