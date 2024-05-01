CREATE OR REPLACE FUNCTION update_ar_import_archive(
    p_ids BIGINT[],
    p_is_archived BOOLEAN,
    OUT v_ar_import_id INT
)
AS $$
DECLARE
ar_import_id BIGINT;
BEGIN
FOR ar_import_id IN SELECT unnest(p_ids)
LOOP
UPDATE ar_import ad
SET
    is_archived = p_is_archived,
    updated_at = CURRENT_TIMESTAMP
WHERE ad.id = ar_import_id;

IF NOT FOUND THEN
            RAISE EXCEPTION 'Record with ID % not found in ar_import table', ar_import_id;
END IF;

        v_ar_import_id := ar_import_id;
END LOOP;
END;
$$ LANGUAGE plpgsql;
