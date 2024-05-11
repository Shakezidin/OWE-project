CREATE OR REPLACE FUNCTION update_adder_data(
    p_unique_id CHARACTER VARYING,
    p_id INT,
    p_date date,
    p_type_ad_mktg CHARACTER VARYING,
    p_gc CHARACTER VARYING,
    p_exact_amount DOUBLE PRECISION,
    p_type1 CHARACTER VARYING,
    p_per_kw_amt  DOUBLE PRECISION,
    p_rep_percent DOUBLE PRECISION,
    p_description text,
    p_notes text,
    p_sys_size DOUBLE PRECISION,
    p_adder_calc DOUBLE PRECISION,
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
        type1 = p_type1,
        gc = p_gc,
        exact_amount = p_exact_amount,
        per_kw_amt = p_per_kw_amt,
        rep_percent = p_rep_percent,
        description = p_description,
        notes = p_notes,
        sys_size = p_sys_size,
        adder_cal = p_adder_calc,
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