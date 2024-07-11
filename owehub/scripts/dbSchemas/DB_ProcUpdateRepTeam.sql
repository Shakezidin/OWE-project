CREATE OR REPLACE FUNCTION update_rep_team(
 p_user_ids INT[],
 p_team_id INT,
 p_delete_mode BOOLEAN DEFAULT FALSE,
 OUT v_ar_id INT
)
AS $$
DECLARE
 v_user_id INT;
BEGIN
 FOREACH v_user_id IN ARRAY p_user_ids LOOP
   IF p_delete_mode THEN
     -- Delete mode: Update user_details to set team_id to NULL
     UPDATE user_details
     SET team_id = NULL,
         updated_at = CURRENT_TIMESTAMP
     WHERE user_id = v_user_id;
   ELSE
     -- Update mode: Update user_details to set team_id to p_team_id
     UPDATE user_details
     SET team_id = p_team_id,
         updated_at = CURRENT_TIMESTAMP
     WHERE user_id = v_user_id;
   END IF;
   -- Check if any rows were updated; if not, raise an exception
   IF NOT FOUND THEN
     RAISE EXCEPTION 'User with user_id % not found', v_user_id;
   END IF;
 END LOOP;
 -- Set the count of users updated
 v_ar_id := cardinality(p_user_ids);
END;
$$ LANGUAGE plpgsql;