CREATE OR REPLACE FUNCTION create_new_adder_data(
    p_unique_id CHARACTER VARYING,
    p_date CHARACTER VARYING,
    p_type_ad_mktg CHARACTER VARYING,
    p_type CHARACTER VARYING,
    p_gc CHARACTER VARYING,
    p_exact_amount CHARACTER VARYING,
    p_per_kw_amt  DOUBLE PRECISION,
    p_rep_percent DOUBLE PRECISION,
    p_description CHARACTER VARYING,
    p_notes CHARACTER VARYING,
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
            type,
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
            p_type,
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
