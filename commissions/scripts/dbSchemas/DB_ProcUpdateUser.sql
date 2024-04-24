CREATE OR REPLACE FUNCTION update_user(
    p_record_id INT,
    p_name VARCHAR(255),
    p_user_code VARCHAR(255),
    p_mobile_number VARCHAR(20),
    p_email_id VARCHAR(255),
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
    v_email_exists BOOLEAN;
    v_current_email VARCHAR(255);
BEGIN
    -- Get the current email of the user
    SELECT email_id INTO v_current_email
    FROM user_details
    WHERE user_id = p_record_id;

    -- Check if the provided email is different from the current email
    IF v_current_email != p_email_id THEN
        -- Check if the user with the same email already exists
        SELECT EXISTS(SELECT 1 FROM user_details WHERE email_id = p_email_id) INTO v_email_exists;

        IF v_email_exists THEN
            RAISE EXCEPTION 'User with email % already exists', p_email_id;
        END IF;
    END IF;

    -- Update user details
    UPDATE user_details
    SET 
        name = p_name,
        user_code = p_user_code,
        mobile_number = p_mobile_number, 
        email_id = p_email_id,
        password_change_required = p_password_change_req,
        reporting_manager = (SELECT user_id FROM user_details WHERE LOWER(name) = LOWER(p_reporting_manager) LIMIT 1),
        dealer_owner = (SELECT user_id FROM user_details WHERE LOWER(name) = LOWER(p_dealer_owner) LIMIT 1),
        role_id = (SELECT role_id FROM user_roles WHERE LOWER(role_name) = LOWER(p_role_name) LIMIT 1),
        user_status = p_user_status,
        user_designation = p_designation,
        description = p_description,
        street_address = p_street_address,
        state = (SELECT state_id FROM states WHERE LOWER(name) = LOWER(p_state) LIMIT 1),
        city = p_city,
        zipcode = (SELECT id FROM zipcodes WHERE LOWER(zipcode) = LOWER(p_zipcode) LIMIT 1),
        country = p_country,
        updated_at = CURRENT_TIMESTAMP
    WHERE user_id = p_record_id
    RETURNING user_id INTO v_user_id;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Record with ID % not found in user_details table', p_record_id;
    END IF;

EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error updating record in user_details: %', SQLERRM;
END;
$$ LANGUAGE plpgsql;
