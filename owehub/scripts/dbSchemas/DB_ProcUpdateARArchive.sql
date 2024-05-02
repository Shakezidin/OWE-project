CREATE OR REPLACE FUNCTION update_ar_archive(
    p_ids BIGINT[],
    p_is_archived BOOLEAN,
    OUT v_ar_id INT
)
AS $$
DECLARE
ar_id BIGINT;
BEGIN
FOR ar_id IN SELECT unnest(p_ids)
LOOP
UPDATE ar
SET
    is_archived = p_is_archived,
    updated_at = CURRENT_TIMESTAMP
WHERE id = ar_id;

IF NOT FOUND THEN
            RAISE EXCEPTION 'Record with ID % not found in ar table', ar_id;
END IF;

        v_ar_id := ar_id;
END LOOP;
END;
$$ LANGUAGE plpgsql;
