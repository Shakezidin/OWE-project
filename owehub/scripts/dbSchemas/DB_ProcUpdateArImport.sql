CREATE OR REPLACE FUNCTION update_ar_import(
    p_id INT,
    p_unique_id               VARCHAR,
    p_customer                VARCHAR,
    p_date                    VARCHAR,
    p_amount                  VARCHAR,
    p_notes                   VARCHAR,
    OUT v_ar_import_id INT
)
RETURNS INT 
AS $$
BEGIN
    UPDATE ar_import
    SET 
        unique_id = p_unique_id,
        customer  = p_customer,
        date = p_date,
        amount = p_amount,
        notes = p_notes,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = p_id
    RETURNING id INTO v_ar_import_id;
IF NOT FOUND THEN
        RAISE EXCEPTION 'Record with ID % not found in ar_import table', p_id;
    END IF;

    -- No need for a RETURN statement when using OUT parameters
EXCEPTION
    WHEN OTHERS THEN
        -- Handle the exception, you can log or re-raise as needed
        RAISE EXCEPTION 'Error updating record in ar_import: %', SQLERRM;
END;
$$ LANGUAGE plpgsql;