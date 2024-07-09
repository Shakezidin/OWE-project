CREATE OR REPLACE FUNCTION update_rep_credit(
    p_unique_id      CHARACTER VARYING,
    p_per_kw          CHARACTER VARYING,
    p_amount         DOUBLE PRECISION,
    p_date           DATE,
    p_approved     CHARACTER VARYING,
    p_notes    CHARACTER VARYING,
    OUT v_rep_credit_id INT
)
RETURNS INT
AS $$
BEGIN
    UPDATE rep_credit
    SET 
        unique_id = p_unique_id,
        per_kw_amt = p_per_kw,
        exact_amt = p_amount,
        date = p_date,
        approved_by = p_approved,
        notes = p_notes,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = p_id
    RETURNING id INTO v_rep_credit_id;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Record with ID % not found in v_adders table', p_id;
    END IF;
    EXCEPTION
      WHEN OTHERS THEN
      RAISE EXCEPTION 'Error updating record in v_adders: %', SQLERRM;
END;
$$ LANGUAGE plpgsql;