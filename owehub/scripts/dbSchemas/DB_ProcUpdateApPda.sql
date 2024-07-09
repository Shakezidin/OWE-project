CREATE OR REPLACE FUNCTION update_ap_pda(
    p_id      INT,
    p_unique_id      CHARACTER VARYING,
    p_payee          CHARACTER VARYING,
    p_amount         DOUBLE PRECISION,
    p_approved          CHARACTER VARYING,
    p_date           DATE,
    p_description    CHARACTER VARYING,
    p_notes     CHARACTER VARYING,
    OUT v_ap_pda_id  INT
)
RETURNS INT
AS $$
BEGIN
    UPDATE ap_pda
    SET 
        unique_id = p_unique_id,
        payee = p_payee,
        amount_ovrd = p_amount,
        approved_by = p_approved,
        date = p_date,
        notes = p_notes,
        description = p_description,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = p_id
    RETURNING id INTO v_ap_pda_id;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Record with ID % not found in v_adders table', p_id;
    END IF;
    EXCEPTION
      WHEN OTHERS THEN
      RAISE EXCEPTION 'Error updating record in v_adders: %', SQLERRM;
END;
$$ LANGUAGE plpgsql;
