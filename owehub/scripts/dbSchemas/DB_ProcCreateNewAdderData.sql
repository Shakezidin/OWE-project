CREATE OR REPLACE FUNCTION create_new_adder_data(
    p_unique_id CHARACTER VARYING,
    p_date date,
    p_type_ad_mktg CHARACTER VARYING,
    p_type1 CHARACTER VARYING,
    p_gc CHARACTER VARYING,
    p_exact_amount DOUBLE PRECISION,
    p_per_kw_amt  DOUBLE PRECISION,
    p_rep_percent DOUBLE PRECISION,
    p_description text,
    p_notes text,
    p_sys_size DOUBLE PRECISION,
    p_adder_cal DOUBLE PRECISION,
    OUT v_adder_credit_id INT
)
RETURNS INT
AS $$
BEGIN
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
            adder_cal
        )
        VALUES (
            p_unique_id,
            p_date,
            p_type_ad_mktg,
            p_type1,
            p_gc,
            p_exact_amount,
            p_per_kw_amt,
            p_rep_percent,
            p_description,
            p_notes,
            p_sys_size,
            p_adder_cal
        )
        RETURNING id INTO v_adder_credit_id;
    EXCEPTION
        WHEN others THEN
            RAISE NOTICE 'Error: %', SQLERRM;
    END;
END;
$$ LANGUAGE plpgsql;
