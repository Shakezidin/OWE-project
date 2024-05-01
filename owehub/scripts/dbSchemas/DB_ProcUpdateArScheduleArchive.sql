CREATE OR REPLACE FUNCTION update_ar_schedule_archive(
    p_ids BIGINT[],
    p_is_archived BOOLEAN,
    OUT v_ar_schedule_id INT
)
AS $$
DECLARE
ar_schedule_id BIGINT;
BEGIN
FOR ar_schedule_id IN SELECT unnest(p_ids)
                                 LOOP
UPDATE ar_schedule
SET
    is_archived = p_is_archived,
    updated_at = CURRENT_TIMESTAMP
WHERE id = ar_schedule_id;

IF NOT FOUND THEN
            RAISE EXCEPTION 'Record with ID % not found in ar_schedule table', ar_schedule_id;
END IF;

        v_ar_schedule_id := ar_schedule_id;
END LOOP;
END;
$$ LANGUAGE plpgsql;
