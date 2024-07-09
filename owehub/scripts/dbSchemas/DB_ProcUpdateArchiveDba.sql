CREATE OR REPLACE FUNCTION update_dba_archive(
    p_ids BIGINT[],
    p_is_archived BOOLEAN,
    OUT v_dba_id INT
)
AS $$
DECLARE
dba_id BIGINT;
BEGIN
FOR dba_id IN SELECT unnest(p_ids)
LOOP
UPDATE dba ad
SET
    is_archived = p_is_archived,
    updated_at = CURRENT_TIMESTAMP
WHERE ad.id = dba_id;

IF NOT FOUND THEN
            RAISE EXCEPTION 'Record with ID % not found in adder_credit table', dba_id;
END IF;

        v_dba_id := dba_id;
END LOOP;
END;
$$ LANGUAGE plpgsql;
