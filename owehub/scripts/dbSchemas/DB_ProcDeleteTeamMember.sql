-- Create or replace the stored procedure to delete a team member
CREATE OR REPLACE FUNCTION delete_team_member(
    p_team_member_id INT
)
RETURNS INT
AS $$
BEGIN
    DELETE FROM team_members
    WHERE team_member_id = p_team_member_id;
    
    RETURN 1; -- Indicate success
END;
$$ LANGUAGE plpgsql;
