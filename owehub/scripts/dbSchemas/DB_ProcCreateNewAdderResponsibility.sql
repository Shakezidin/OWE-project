CREATE OR REPLACE FUNCTION create_new_adder_responsibility(   
    p_pay_scale text,
    p_percentage DOUBLE PRECISION,
    OUT v_adder_responsibility_id INT
)
RETURNS INT
AS $$
BEGIN
    BEGIN
        -- Insert new entry in adder responsibility table --
        INSERT INTO adder_responsibility (
            pay_scale,
            percentage,
            is_archived
        )
        VALUES (
            p_pay_scale,
            p_percentage,
            FALSE
        )
        RETURNING id INTO v_adder_responsibility_id;
    EXCEPTION
        WHEN others THEN
            RAISE NOTICE 'Error: %', SQLERRM;
    END;
END;
$$ LANGUAGE plpgsql;
