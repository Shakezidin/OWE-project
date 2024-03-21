-- Create a stored procedure to new user account
CREATE OR REPLACE FUNCTION create_new_user(
    p_name VARCHAR(255),
    p_mobile_number VARCHAR(20),
    p_email_id VARCHAR(255),
    p_password VARCHAR(255),
    p_designation VARCHAR(255),
    p_role_name VARCHAR(50),
    p_user_code VARCHAR(255),
    p_password_change_req BOOLEAN,
    p_reporting_manager VARCHAR(255),
    p_role VARCHAR(255),
    p_user_status VARCHAR(50),
    p_description VARCHAR(255),
    OUT v_user_id INT
)
RETURNS INT
AS $$
DECLARE
    v_role_id INT;
    v_user_details_id INT;
BEGIN
    -- Get the role_id based on the provided role_name
    SELECT role_id INTO v_role_id
    FROM user_roles
    WHERE role_name = p_role_name;

    -- Check if the role exists
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Invalid Role % not found', p_role_name;
    END IF;

    -- If user with same name and role_id already exists, raise an exception
    IF v_user_details_id IS NOT NULL THEN
        RAISE EXCEPTION 'User with name % % and role % already exists', p_name, p_last_name, p_role_name;
    END IF;

    -- Insert a new user into user_details table
    INSERT INTO user_details (
        name,
        user_code,
        mobile_number,
        email_id,
        password,
        password_change_required,
        designation,
        role_id,
        reporting_manager,
        role,
        user_status,
        description
    )
    VALUES (
        p_name,
        p_user_code,
        p_mobile_number,
        p_email_id,
        p_password,
        p_password_change_req,
        p_designation,
        v_role_id,
        p_reporting_manager,
        p_role,
        p_user_status,
        p_description
    )
    RETURNING user_id INTO v_user_id;

END;
$$ LANGUAGE plpgsql;
