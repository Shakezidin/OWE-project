CREATE OR REPLACE FUNCTION update_rep_team(
    p_team_id INT,
    p_sale_rep_codes TEXT[],
    p_manager_codes TEXT[]
)
RETURNS VOID
AS $$
DECLARE
    sale_rep_id INT;
    manager_id INT;
    sale_rep_code TEXT;
    manager_code TEXT;
BEGIN
    FOREACH sale_rep_code IN ARRAY p_sale_rep_codes
        LOOP
            SELECT user_id INTO sale_rep_id FROM user_details WHERE user_code = sale_rep_code;
            INSERT INTO team_members (
                team_id,
                user_id,
                role_in_team
            )
            VALUES (
                p_team_id,
                sale_rep_id,
                'member'
            )
            ON CONFLICT (team_id, user_id) DO NOTHING;
        END LOOP;

    FOREACH manager_code IN ARRAY p_manager_codes
        LOOP
            SELECT user_id INTO manager_id FROM user_details WHERE user_code = manager_code;
            INSERT INTO team_members (
                team_id,
                user_id,
                role_in_team
            )
            VALUES (
                p_team_id,
                manager_id,
                'manager'
            )
            ON CONFLICT (team_id, user_id) DO NOTHING;
        END LOOP;
END;
$$ LANGUAGE plpgsql;
