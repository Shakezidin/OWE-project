CREATE OR REPLACE FUNCTION create_new_adder_credit(
    p_unique_id character varying,
    p_pay_scale text,
    p_type text,
    p_min_rate DOUBLE PRECISION,
    p_max_rate DOUBLE PRECISION,
    OUT v_adder_credit_id INT
)
RETURNS INT
AS $$
BEGIN
    BEGIN
        -- Insert new entry in adder credit table --
        INSERT INTO adder_credit (
            unique_id,
            pay_scale,
            type,
            min_rate,
            max_rate,
            is_archived
        )
        VALUES (
            p_unique_id,
            p_pay_scale,
            p_type,
            p_min_rate,
            p_max_rate,
            FALSE
        )
        RETURNING id INTO v_adder_credit_id;
    EXCEPTION
        WHEN others THEN
            RAISE NOTICE 'Error: %', SQLERRM;
    END;
END;
$$ LANGUAGE plpgsql;
