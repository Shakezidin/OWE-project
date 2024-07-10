
CREATE OR REPLACE FUNCTION update_marketing_fee(
    p_record_id INT,
    p_source VARCHAR,
    p_dba VARCHAR,
    p_state VARCHAR,
    p_fee_rate VARCHAR,
    p_chg_dlr BOOLEAN,
    p_pay_src BOOLEAN,
    p_start_date VARCHAR,
    p_end_date VARCHAR,
    p_description VARCHAR,
    OUT v_marketing_fee_id INT
)
RETURNS INT 
AS $$
BEGIN
    UPDATE marketing_fees
    SET 
        source_id = (SELECT id FROM source WHERE LOWER(name) = LOWER(p_source) LIMIT 1),
        dba = p_dba,
        state_id = (SELECT state_id FROM states WHERE LOWER(name) = LOWER(p_state) LIMIT 1),
        fee_rate = p_fee_rate,
        chg_dlr = p_chg_dlr,
        pay_src = p_pay_src,
        start_date = p_start_date,
        end_date = p_end_date,
        description = p_description,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = p_record_id
    RETURNING id INTO v_marketing_fee_id;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Record with ID % not found in marketing_fees table', p_record_id;
    END IF;

    -- No need for a RETURN statement when using OUT parameters
EXCEPTION
    WHEN OTHERS THEN
        -- Handle the exception, you can log or re-raise as needed
        RAISE EXCEPTION 'Error updating record in marketing_fees: %', SQLERRM;
END;
$$ LANGUAGE plpgsql;
