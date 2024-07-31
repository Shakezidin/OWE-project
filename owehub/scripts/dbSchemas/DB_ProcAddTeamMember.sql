CREATE OR REPLACE FUNCTION update_team_members(
    p_team_id INT,
    p_sale_rep_codes TEXT[],
    p_manager_codes TEXT[]
)
RETURNS INT
AS $$
DECLARE
    sale_rep_id INT;
    manager_id INT;
    sale_rep_code TEXT;
    manager_code TEXT;
BEGIN
    -- Update sale representatives
    FOREACH sale_rep_code IN ARRAY p_sale_rep_codes
    LOOP
        -- Fetch user_id based on user_code
        SELECT user_id INTO sale_rep_id FROM user_details WHERE user_code = sale_rep_code;

        -- Update team member role
        UPDATE team_members
        SET role_in_team = 'member'
        WHERE team_id = p_team_id
          AND user_id = sale_rep_id;
    END LOOP;

    -- Update managers
    FOREACH manager_code IN ARRAY p_manager_codes
    LOOP
        -- Fetch user_id based on user_code
        SELECT user_id INTO manager_id FROM user_details WHERE user_code = manager_code;

        -- Update team member role
        UPDATE team_members
        SET role_in_team = 'manager'
        WHERE team_id = p_team_id
          AND user_id = manager_id;
    END LOOP;

    RETURN 1; -- Indicate success
END;
$$ LANGUAGE plpgsql;
