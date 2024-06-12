CREATE OR REPLACE FUNCTION update_appt_setters_archive(
    p_ids BIGINT[],
    p_is_archived BOOLEAN,
    OUT v_appt_setters_id INT
)
AS $$
DECLARE
appt_setters_id BIGINT;
BEGIN
FOR appt_setters_id IN SELECT unnest(p_ids)
LOOP
UPDATE appt_setters ad
SET
    is_archived = p_is_archived,
    updated_at = CURRENT_TIMESTAMP
WHERE ad.id = appt_setters_id;

IF NOT FOUND THEN
            RAISE EXCEPTION 'Record with ID % not found in appt_setters table', appt_setters_id;
END IF;

        v_appt_setters_id := appt_setters_id;
END LOOP;
END;
$$ LANGUAGE plpgsql;
