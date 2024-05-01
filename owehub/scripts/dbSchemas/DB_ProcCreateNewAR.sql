CREATE OR REPLACE FUNCTION create_new_ar(
    p_unique_id character varying,
    p_pay_scale text,
    p_position character varying,
    p_adjustment character varying,
    p_min_rate DOUBLE PRECISION,
    p_max_rate DOUBLE PRECISION,
    OUT v_ar_id INT
)
RETURNS INT
AS $$
BEGIN
    BEGIN
        -- Insert new entry in adder responsibility table --
        INSERT INTO ar (
            unique_id,
            pay_scale,
            position,
            adjustment,
            min_rate,
            max_rate,
            is_archived
        )
        VALUES (
            p_unique_id,
            p_pay_scale,
            p_position,
            p_adjustment,
            p_min_rate,
            p_max_rate,
            FALSE
        )
        RETURNING id INTO v_ar_id;
    EXCEPTION
        WHEN others THEN
            RAISE NOTICE 'Error: %', SQLERRM;
    END;
END;
$$ LANGUAGE plpgsql;
