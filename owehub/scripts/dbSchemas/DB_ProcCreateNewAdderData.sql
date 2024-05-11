CREATE OR REPLACE FUNCTION create_new_adder_data(
    p_unique_id CHARACTER VARYING,
    p_date date,
    p_type_ad_mktg CHARACTER VARYING,
    p_gc CHARACTER VARYING,
    p_exact_amount DOUBLE PRECISION,
    p_per_kw_amt  DOUBLE PRECISION,
    p_rep_percent DOUBLE PRECISION,
    p_description text,
    p_notes text,
    OUT v_adder_credit_id INT
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
 
    -- Insert data into adder_data table
    BEGIN
        INSERT INTO adder_data (
            unique_id,
            date,
            type_ad_mktg,
            type1,
            gc,
            exact_amount,
            per_kw_amt,
            rep_percent,
            description,
            notes,
            sys_size,
            adder_calc
        )
        VALUES (
            p_unique_id,
            p_date,
            p_type_ad_mktg,
            'Adder',
            p_gc,
            p_exact_amount,
            p_per_kw_amt,
            p_rep_percent,
            p_description,
            p_notes,
            v_sys_size,
            v_adder_calc
        )
        RETURNING id INTO v_adder_credit_id;
    EXCEPTION
        WHEN others THEN
            RAISE NOTICE 'Error: %', SQLERRM;
    END;
END;
$$ LANGUAGE plpgsql;
 