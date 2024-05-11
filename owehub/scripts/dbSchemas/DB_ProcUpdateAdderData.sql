CREATE OR REPLACE FUNCTION update_adder_data(
    p_id INT,
    p_unique_id VARCHAR,
    p_date date,
    p_type_ad_mktg CHARACTER VARYING,
    p_gc CHARACTER VARYING,
    p_exact_amount DOUBLE PRECISION,
    p_per_kw_amt  DOUBLE PRECISION,
    p_rep_percent DOUBLE PRECISION,
    p_description text,
    p_notes text,
    OUT v_adder_data_id INT
)
RETURNS INT 
AS $$
DECLARE
    v_sys_size DOUBLE PRECISION;
    v_adder_calc DOUBLE PRECISION;
BEGIN

    SELECT system_size INTO v_sys_size
    FROM consolidated_data_view
    WHERE consolidated_data_view.unique_id = p_unique_id;
 
    IF p_exact_amount != 0 THEN
        v_adder_calc := p_exact_amount;
    ELSE
        IF p_per_kw_amt != 0 THEN
            v_adder_calc := p_per_kw_amt * v_sys_size;
        END IF;
    END IF;

    UPDATE adder_data
    SET 
        unique_id = p_unique_id,
        date = p_date,
        type_ad_mktg = p_type_ad_mktg,
        type1 = 'Adder',
        gc = p_gc,
        exact_amount = p_exact_amount,
        per_kw_amt = p_per_kw_amt,
        rep_percent = p_rep_percent,
        description = p_description,
        notes = p_notes,
        sys_size = v_sys_size,
        adder_cal = v_adder_calc,
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