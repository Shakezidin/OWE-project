CREATE OR REPLACE FUNCTION update_ap_ded(
    p_id      INT,
    p_unique_id      CHARACTER VARYING,
    p_payee          CHARACTER VARYING,
    p_amount         DOUBLE PRECISION,
    p_date           DATE,
    p_short_code     CHARACTER VARYING,
    p_description    CHARACTER VARYING,
    OUT v_ap_ded_id  INT
)
RETURNS INT
AS $$
BEGIN
    UPDATE ap_ded
    SET 
        unique_id = p_unique_id,
        payee = p_payee,
        amount = p_amount,
        date = p_date,
        short_code = p_short_code,
        description = p_description,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = p_id
    RETURNING id INTO v_ap_ded_id;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Record with ID % not found in v_adders table', p_id;
    END IF;
    EXCEPTION
      WHEN OTHERS THEN
      RAISE EXCEPTION 'Error updating record in v_adders: %', SQLERRM;
END;
$$ LANGUAGE plpgsql;
