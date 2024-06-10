CREATE OR REPLACE FUNCTION update_reconcile_archive(
    p_ids BIGINT[],
    p_is_archived BOOLEAN,
    OUT v_reconcile_data_id INT
)
AS $$
DECLARE
    reconcile_data_id BIGINT;
BEGIN
    FOR reconcile_data_id IN SELECT unnest(p_ids)
    LOOP
        UPDATE reconcile
        SET
            is_archived = p_is_archived,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = reconcile_data_id;

        IF NOT FOUND THEN
            RAISE EXCEPTION 'Record with ID % not found in reconcile_data table', reconcile_data_id;
        END IF;

        v_reconcile_data_id := reconcile_data_id;
    END LOOP;
END;
$$ LANGUAGE plpgsql;
