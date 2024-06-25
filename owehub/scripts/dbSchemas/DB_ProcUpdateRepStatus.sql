CREATE OR REPLACE FUNCTION create_rep_status(
    p_id      INT,
    p_name      CHARACTER VARYING,
    p_status         CHARACTER VARYING,
    OUT v_rep_status_id  INT
)
RETURNS INT
AS $$
BEGIN
    UPDATE rep_status
    SET 
        name = p_name,
        status = p_status,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = p_id
    RETURNING id INTO v_rep_status_id;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Record with ID % not found in v_adders table', p_id;
    END IF;
    EXCEPTION
      WHEN OTHERS THEN
      RAISE EXCEPTION 'Error updating record in v_adders: %', SQLERRM;
END;
$$ LANGUAGE plpgsql;
