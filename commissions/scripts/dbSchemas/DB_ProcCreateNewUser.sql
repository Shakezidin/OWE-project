-- Create a stored procedure to new user account
CREATE OR REPLACE FUNCTION create_new_user(
    p_first_name VARCHAR(255),
    p_last_name VARCHAR(255),
    p_mobile_number VARCHAR(20),
    p_email_id VARCHAR(255),
    p_password VARCHAR(255),
    p_designation VARCHAR(255),
    p_role_name VARCHAR(50),
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

    -- Get the dealer_id based on the provided dealer_name
    SELECT id INTO v_user_details_id
    FROM v_user_details
    WHERE dealer_name = p_first_name;

    -- Check if the dealer exists
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Invalid Dealer % not found', p_manager_name;
    END IF;
    
    -- Insert a new user into user_auth table
    INSERT INTO user_auth (
        first_name,
        last_name,
        mobile_number,
        email_id,
        password,
        password_change_required,
        designation,
        role_id,
        user_details_id
    )
    VALUES (
        p_first_name,
        p_last_name,
        p_mobile_number,
        p_email_id,
        p_password,
        TRUE,           -- Set password_change_required to TRUE by default
        p_designation,
        v_role_id,
        v_user_details_id
    )
    RETURNING user_id INTO v_user_id;

END;
$$ LANGUAGE plpgsql;