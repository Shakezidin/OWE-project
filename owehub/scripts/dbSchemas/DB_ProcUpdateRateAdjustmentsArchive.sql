CREATE OR REPLACE FUNCTION update_rate_adjustments_archive(
    p_ids BIGINT[],
    p_is_archived BOOLEAN,
    OUT v_rate_adjustments_id INT
)
AS $$
DECLARE
rate_adjustments_id BIGINT;
BEGIN
FOR rate_adjustments_id IN SELECT unnest(p_ids)
                                      LOOP
UPDATE rate_adjustments
SET
    is_archived = p_is_archived,
    updated_at = CURRENT_TIMESTAMP
WHERE id = rate_adjustments_id;

IF NOT FOUND THEN
            RAISE EXCEPTION 'Record with ID % not found in rate_adjustments table', rate_adjustments_id;
END IF;

        v_rate_adjustments_id := rate_adjustments_id;
END LOOP;
END;
$$ LANGUAGE plpgsql;
