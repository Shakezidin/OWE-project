-- Create a stored procedure to new appointment setter
CREATE OR REPLACE FUNCTION create_appointment_setter(
    p_team_name character varying,
	p_first_name character varying,
    p_last_name character varying,
    p_pay_rate  double precision,
    p_start_date character varying,
    p_end_date character varying,
    p_description character varying,
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
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Invalid Team % not found', p_team_name;
    END IF;

    -- Insert a new appointment setter into appointment_setters table
    INSERT INTO appointment_setters (
        team_id,
        first_name,
        last_name,
        pay_rate,
        start_date,
        end_date,
        description
    )
    VALUES (
        v_team_id,
        p_first_name,
        p_last_name,
        p_pay_rate,
        p_start_date,
        p_end_date,
        p_description
    )
    RETURNING setters_id INTO v_setters_id;

END;
$$ LANGUAGE plpgsql;