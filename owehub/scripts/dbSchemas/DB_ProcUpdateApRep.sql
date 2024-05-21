CREATE OR REPLACE FUNCTION update_ar_rep(
    p_id INT,
    p_unique_id VARCHAR,
    p_rep VARCHAR,
    p_dba VARCHAR,
    p_type VARCHAR,
    p_date DATE,
    p_amount DOUBLE PRECISION,
    p_method VARCHAR,
    p_cbiz VARCHAR,
    p_transaction VARCHAR,
    p_notes VARCHAR,
    OUT v_ar_rep_id INT
)
RETURNS INT 
AS $$
BEGIN
    UPDATE ar_rep
    SET 
        unique_id = p_unique_id,
        rep = p_rep,
        dba = p_dba,
        type = p_type,
        date = p_date,
        amount = p_amount,
        method = p_method,
        cbiz = p_cbiz,
        transaction = p_transaction,
        notes = p_notes,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = p_id
    RETURNING id INTO v_ar_rep_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Record with ID % not found in ar_rep table', p_id;
    END IF;

    RETURN v_ar_rep_id;
EXCEPTION
    WHEN OTHERS THEN
        -- Handle the exception, you can log or re-raise as needed
        RAISE EXCEPTION 'Error updating record in ar rep: %', SQLERRM;
END;
$$ LANGUAGE plpgsql;
