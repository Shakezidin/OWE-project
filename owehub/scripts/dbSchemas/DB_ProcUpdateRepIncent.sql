CREATE OR REPLACE FUNCTION create_rep_incent(
    p_id      INT,
    p_name      CHARACTER VARYING,
    p_doll         DOUBLE PRECISION,
    p_month         CHARACTER VARYING,
    p_comment     CHARACTER VARYING,
    OUT v_rep_incent_id  INT
)
RETURNS INT
AS $$
BEGIN
    UPDATE rep_incent
    SET 
        name = p_name,
        doll_div_kw = p_doll,
        month = p_month,
        comment = p_comment,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = p_id
    RETURNING id INTO v_rep_incent_id;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Record with ID % not found in v_adders table', p_id;
    END IF;
    EXCEPTION
      WHEN OTHERS THEN
      RAISE EXCEPTION 'Error updating record in v_adders: %', SQLERRM;
END;
$$ LANGUAGE plpgsql;
