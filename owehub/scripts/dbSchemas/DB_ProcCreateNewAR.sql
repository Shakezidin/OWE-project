CREATE OR REPLACE FUNCTION create_new_ar(
    p_unique_id character varying,
    p_customer text,
    p_date character varying,
    p_amount text,
    p_notes text,
    OUT v_ar_id INT
)
RETURNS INT
AS $$
BEGIN
    BEGIN
        -- Insert new entry in adder responsibility table --
        INSERT INTO ar (
            unique_id,
            customer,
            date,
            amount,
            notes,
            is_archived
        )
        VALUES (
            p_unique_id,
            p_customer,
            p_date,
            p_amount,
            p_notes,
            FALSE
        )
        RETURNING id INTO v_ar_id;
    EXCEPTION
        WHEN others THEN
            RAISE NOTICE 'Error: %', SQLERRM;
    END;
END;
$$ LANGUAGE plpgsql;
