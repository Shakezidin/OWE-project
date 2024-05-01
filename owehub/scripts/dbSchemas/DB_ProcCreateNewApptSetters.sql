-- Create a stored procedure to new appointment setter
CREATE OR REPLACE FUNCTION create_appt_setters(
    p_unique_id character varying,
	p_name character varying,
    p_team_name character varying,
    p_pay_rate  character varying,
    p_start_date character varying,
    p_end_date character varying,
    OUT v_setters_id INT
)
RETURNS INT
AS $$
DECLARE
    v_team_id INT;
BEGIN
    -- Get the team_id based on the provided team_name
    SELECT team_id INTO v_team_id
    FROM teams
    WHERE team_name = p_team_name;

    -- Check if the team exists
    IF v_team_id IS NULL THEN
        RAISE EXCEPTION 'Invalid Team % not found', p_team_name;
    END IF;

    -- Insert a new appointment setter into appt_setters table
    INSERT INTO appt_setters (
        unique_id,
        name,
        team_id,
        pay_rate,
        is_archived,
        start_date,
        end_date
    )
    VALUES (
        p_unique_id,
        p_name,
        v_team_id,
        p_pay_rate,
        FALSE,
        p_start_date,
        p_end_date
    )
    RETURNING id INTO v_setters_id;

END;
$$ LANGUAGE plpgsql;