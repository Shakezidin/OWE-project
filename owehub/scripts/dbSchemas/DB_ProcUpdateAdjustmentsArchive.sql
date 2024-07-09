CREATE OR REPLACE FUNCTION update_adjustments_archive(
    p_ids BIGINT[],
    p_is_archived BOOLEAN,
    OUT v_adjustments_id INT
)
AS $$
DECLARE
    adjustments_id BIGINT;
BEGIN
    FOR adjustments_id IN SELECT unnest(p_ids)
    LOOP
        UPDATE adjustments 
        SET
            is_archived = p_is_archived,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = adjustments_id; -- Fixed: WHERE clause corrected

        IF NOT FOUND THEN
            RAISE EXCEPTION 'Record with ID % not found in adjustments table', adjustments_id;
        END IF;

        v_adjustments_id := adjustments_id;
    END LOOP;
END;
$$ LANGUAGE plpgsql;
