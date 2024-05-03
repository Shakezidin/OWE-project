CREATE OR REPLACE FUNCTION update_adder_data(
    p_id INT,
    p_unique_id               VARCHAR,
    p_date CHARACTER VARYING,
    p_type_ad_mktg CHARACTER VARYING,
    p_type CHARACTER VARYING,
    p_gc CHARACTER VARYING,
    p_exact_amount CHARACTER VARYING,
    p_per_kw_amt  DOUBLE PRECISION,
    p_rep_percent INTEGER,
    p_description CHARACTER VARYING,
    p_notes CHARACTER VARYING,
    p_sys_size DOUBLE PRECISION,
    p_adder_cal DOUBLE PRECISION,
    OUT v_adder_data_id INT
)
RETURNS INT 
AS $$
BEGIN
    UPDATE adder_data
    SET 
        unique_id = p_unique_id,
        date = p_date,
        type_ad_mktg = p_type_ad_mktg,
        type = p_type,
        gc = p_gc,
        exact_amount = p_exact_amount,
        per_kw_amt = p_per_kw_amt,
        rep_percent = p_rep_percent,
        description = p_description,
        notes = p_notes,
        sys_size = p_sys_size,
        adder_cal = p_adder_cal,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = p_id
    RETURNING id INTO v_adder_data_id;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Record with ID % not found in adder_data table', p_id;
    END IF;
    
EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error updating record in adder_data: %', SQLERRM;
END;
$$ LANGUAGE plpgsql;