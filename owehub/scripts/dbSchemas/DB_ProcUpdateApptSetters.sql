CREATE OR REPLACE FUNCTION update_appt_setters(
    p_id INT,
    p_unique_id                VARCHAR,
    p_name                     VARCHAR,
    p_team_name                VARCHAR,
    p_pay_rate                 VARCHAR,
    p_start_date               date,
    p_end_date                 date,
    OUT v_appt_setters_id INT
)
RETURNS INT 
AS $$
BEGIN
    UPDATE appt_setters
    SET 
        unique_id = p_unique_id,
        name  = p_name,
        team_id = (SELECT team_id FROM teams WHERE LOWER(team_name) = LOWER(p_team_name) LIMIT 1),
        pay_rate = p_pay_rate,
        start_date = p_start_date,
        end_date = p_end_date,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = p_id
    RETURNING id INTO v_appt_setters_id;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Record with ID % not found in appt setter table', p_id;
    END IF;

    -- No need for a RETURN statement when using OUT parameters
EXCEPTION
    WHEN OTHERS THEN
        -- Handle the exception, you can log or re-raise as needed
        RAISE EXCEPTION 'Error updating record in appt setter: %', SQLERRM;
END;
$$ LANGUAGE plpgsql;
