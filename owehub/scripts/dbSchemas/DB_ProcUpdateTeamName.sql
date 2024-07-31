-- Create or replace the stored procedure to update the team name and return a fixed value of 1
CREATE OR REPLACE FUNCTION update_team_name(
    p_team_id INT,
    p_team_name VARCHAR
)
RETURNS INT
AS $$
BEGIN
    UPDATE teams
    SET team_name = p_team_name,
        updated_at = CURRENT_TIMESTAMP
    WHERE team_id = p_team_id;
    
    -- Return a fixed value of 1 to indicate success
    RETURN 1;
END;
$$ LANGUAGE plpgsql;
