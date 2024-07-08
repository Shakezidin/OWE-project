-- Create a stored procedure to new team
CREATE OR REPLACE FUNCTION create_new_team(
    p_team_name character varying,
    p_team_description character varying,
    OUT v_team_id INT
)
RETURNS INT
AS $$
DECLARE
BEGIN
    -- Insert a new team into teams table
    INSERT INTO teams (
        team_name,
        description
    )
    VALUES (
        p_team_name,
        p_team_description
    )
    RETURNING team_id INTO v_team_id;

END;
$$ LANGUAGE plpgsql;