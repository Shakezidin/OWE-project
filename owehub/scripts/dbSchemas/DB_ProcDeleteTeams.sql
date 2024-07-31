-- Create or replace the stored procedure to delete teams and return a fixed value of 1
CREATE OR REPLACE FUNCTION delete_teams (
    p_team_ids INT[]
)
RETURNS INT
AS $$
BEGIN
    -- Delete team members associated with the specified team IDs
    DELETE FROM team_members WHERE team_id = ANY(p_team_ids);

    -- Delete teams
    DELETE FROM teams WHERE team_id = ANY(p_team_ids);

    -- Return a fixed value of 1 to indicate success
    RETURN 1;
END;
$$ LANGUAGE plpgsql;
