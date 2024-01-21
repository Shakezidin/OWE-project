-- Create a stored procedure to new user account
CREATE OR REPLACE FUNCTION create_new_user(
    p_first_name VARCHAR(255),
    p_last_name VARCHAR(255),
    p_mobile_number VARCHAR(20),
    p_email_id VARCHAR(255),
    p_password VARCHAR(255),
    p_designation VARCHAR(255),
    p_asssigned_dealer_name character varying,
    p_role_name VARCHAR(50)
)
RETURNS SERIAL
AS $$
DECLARE
    v_user_id SERIAL;
    v_role_id INT;
BEGIN
    -- Get the role_id based on the provided role_name
    SELECT role_id INTO v_role_id
    FROM user_roles
    WHERE role_name = p_role_name;

    -- Check if the role exists
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Invalid Role % not found', p_role_name;
    END IF;

    -- Insert a new user into user_auth table
    INSERT INTO user_auth (
        first_name,
        last_name,
        mobile_number,
        email_id,
        password,
        password_change_required,
        p_designation,
        role_id
    )
    VALUES (
        p_first_name,
        p_last_name,
        p_mobile_number,
        p_email_id,
        p_password,
        TRUE, -- Set password_change_required to TRUE by default
        designation,
        v_role_id
    )
    RETURNING user_id INTO v_user_id;

    -- Return the newly inserted user_id
    RETURN v_user_id;

END;
$$ LANGUAGE plpgsql;