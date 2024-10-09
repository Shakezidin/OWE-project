ALTER TABLE teams
    DROP CONSTRAINT IF EXISTS teams_dealer_fkey;

-- Drop the columns that were added
ALTER TABLE teams
    DROP COLUMN IF EXISTS partner_id;

CREATE OR REPLACE FUNCTION create_new_team(
    p_team_name character varying,
    p_dealer_id INT,
    p_team_description character varying,
    p_sale_rep_codes TEXT[],
    p_manager_codes TEXT[],
    OUT v_team_id INT
)
RETURNS INT
AS $$
DECLARE
    sale_rep_id INT;
    manager_id INT;
    sale_rep_code TEXT;
    manager_code TEXT;
BEGIN
    INSERT INTO teams (
        team_name,
        description,
        dealer_id
    )
    VALUES (
        p_team_name,
        p_team_description,
        p_dealer_id
    )
    RETURNING team_id INTO v_team_id;
    FOREACH sale_rep_code IN ARRAY p_sale_rep_codes
        LOOP
            SELECT user_id INTO sale_rep_id FROM user_details WHERE user_code = sale_rep_code;
            INSERT INTO team_members (
                team_id,
                user_id,
                role_in_team
            )
            VALUES (
                v_team_id,
                sale_rep_id,
                'member'
            );
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
                v_team_id,
                manager_id,
                'manager'
            );
        END LOOP;
END;
$$ LANGUAGE plpgsql;