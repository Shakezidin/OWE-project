CREATE OR REPLACE FUNCTION create_new_ar_import(
    p_unique_id character varying,
    p_customer text,
    p_date character varying,
    p_amount character varying,
    p_notes character varying,
    OUT v_ar_import_id INT
)
RETURNS INT
AS $$
BEGIN
    BEGIN
        -- Insert new entry in adder responsibility table --
        INSERT INTO ar_import (
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
        RETURNING id INTO v_ar_import_id;
    EXCEPTION
        WHEN others THEN
            RAISE NOTICE 'Error: %', SQLERRM;
    END;
END;
$$ LANGUAGE plpgsql;
