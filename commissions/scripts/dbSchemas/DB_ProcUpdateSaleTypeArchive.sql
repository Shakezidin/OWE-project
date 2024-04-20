CREATE OR REPLACE FUNCTION update_sale_type_archive(
    p_ids BIGINT[],
    p_is_archived BOOLEAN,
    OUT v_sale_type_id INT
)
AS $$
DECLARE
    sale_type_id BIGINT;
BEGIN
    FOR sale_type_id IN SELECT unnest(p_ids)
    LOOP
        UPDATE sale_type st
        SET
            is_archived = p_is_archived,
            updated_at = CURRENT_TIMESTAMP
        WHERE st.id = sale_type_id;

        IF NOT FOUND THEN
            RAISE EXCEPTION 'Record with ID % not found in sale_type table', sale_type_id;
        END IF;

        v_sale_type_id := sale_type_id;
    END LOOP;
END;
$$ LANGUAGE plpgsql;
