CREATE OR REPLACE FUNCTION update_timeline_sla(
    p_record_id INT,
    p_type_m2m VARCHAR,
    p_state VARCHAR,
    p_days INT,
    p_start_date VARCHAR,
    p_end_date VARCHAR,
    OUT v_timeline_sla_id INT
)
RETURNS INT 
AS $$
BEGIN
    UPDATE timeline_sla
    SET 
        type_m2m = p_type_m2m,
        state_id = (SELECT state_id FROM states WHERE name = p_state LIMIT 1),
        days = p_days,
        start_date = p_start_date,
        end_date = p_end_date,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = p_record_id
    RETURNING id INTO v_timeline_sla_id;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Record with ID % not found in timeline_sla table', p_record_id;
    END IF;

EXCEPTION
    WHEN OTHERS THEN
        -- Handle the exception, you can log or re-raise as needed
        RAISE EXCEPTION 'Error updating record in timeline_sla: %', SQLERRM;
END;
$$ LANGUAGE plpgsql;
