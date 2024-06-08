-- Create a stored procedure to new team
CREATE OR REPLACE FUNCTION create_new_team(
    p_team_name character varying,
    OUT v_team_id INT
)
RETURNS INT
AS $$
DECLARE
BEGIN
    -- Insert a new team into teams table
    INSERT INTO teams (
        team_name
    )
    VALUES (
        p_team_name
    )
    RETURNING team_id INTO v_team_id;

END;
$$ LANGUAGE plpgsql;