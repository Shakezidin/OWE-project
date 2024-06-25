CREATE OR REPLACE FUNCTION create_dba(
    p_id      INT,
    p_name      CHARACTER VARYING,
    p_dba         CHARACTER VARYING,
    OUT v_dba_id  INT
)
RETURNS INT
AS $$
BEGIN
    UPDATE dba
    SET 
        name = p_name,
        dba = p_dba,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = p_id
    RETURNING id INTO v_dba_id;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Record with ID % not found in v_adders table', p_id;
    END IF;
    EXCEPTION
      WHEN OTHERS THEN
      RAISE EXCEPTION 'Error updating record in v_adders: %', SQLERRM;
END;
$$ LANGUAGE plpgsql;
