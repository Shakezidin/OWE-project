-- Create a stored procedure to create a new user account
CREATE OR REPLACE FUNCTION create_new_user(
    p_name VARCHAR(255),
    p_user_code VARCHAR(255),
    p_mobile_number VARCHAR(20),
    p_email_id VARCHAR(255),
    p_password VARCHAR(255),
    p_password_change_req BOOLEAN,
    p_reporting_manager VARCHAR(255),
    p_role_name VARCHAR(50),
    p_user_status VARCHAR(50),
    p_designation VARCHAR(255),
    p_description VARCHAR(255),
    OUT v_user_id INT
)
RETURNS INT
AS $$
DECLARE
    v_role_id INT;
    v_user_details_id INT;
    v_reporting_manager_id INT;
BEGIN
    -- Get the role_id based on the provided role_name
    SELECT role_id INTO v_role_id
    FROM user_roles
    WHERE role_name = p_role_name;

    -- Check if the role exists
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Invalid Role % not found', p_role_name;
    END IF;

    -- Check if the user with the same email already exists
    SELECT user_id INTO v_user_details_id
    FROM user_details
    WHERE email_id = p_email_id;

    IF v_user_details_id IS NOT NULL THEN
        RAISE EXCEPTION 'User with email % already exists', p_email_id;
    END IF;

    -- Get the reporting manager's user_id based on the provided email
    SELECT user_id INTO v_reporting_manager_id
    FROM user_details
    WHERE name = p_reporting_manager;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Reporting manager with name % not found', p_reporting_manager;
    END IF;

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
            role_id,
            user_status,
            user_designation,
            description
        )
        VALUES (
            p_name,
            p_user_code,
            p_mobile_number,
            p_email_id,
            p_password,
            p_password_change_req,
            v_reporting_manager_id,
            v_role_id,
            p_user_status,
            p_designation,
            p_description
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
