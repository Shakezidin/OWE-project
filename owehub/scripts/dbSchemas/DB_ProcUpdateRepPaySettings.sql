CREATE OR REPLACE FUNCTION update_rep_pay_settings(
    p_id                      INT,
    p_unique_id               character varying,
    p_state_name              character varying,
    p_pay_scale               character varying,
    p_position                character varying,
    p_b_e                     character varying,
    p_start_date              character varying,
    p_end_date                character varying,
    OUT v_rep_pay_settings_id    INT
)
RETURNS INT
AS $$
BEGIN
    UPDATE rep_pay_settings
    SET 
        unique_id = p_unique_id,
        state_id = (SELECT state_id FROM states WHERE LOWER(name) = LOWER(p_state_name) LIMIT 1),
        pay_scale = p_pay_scale,
        position = p_position,
        b_e = p_b_e,
        start_date = p_start_date,
        end_date = p_end_date
    WHERE id = p_id
    RETURNING id INTO v_rep_pay_settings_id;
IF NOT FOUND THEN
        RAISE EXCEPTION 'Record with ID % not found in rep_pay_settings table', p_id;
    END IF;

    -- No need for a RETURN statement when using OUT parameters
EXCEPTION
    WHEN OTHERS THEN
        -- Handle the exception, you can log or re-raise as needed
        RAISE EXCEPTION 'Error updating record in rep_pay_settings: %', SQLERRM;
END;
$$ LANGUAGE plpgsql;