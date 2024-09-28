CREATE OR REPLACE FUNCTION update_auto_adder_archive(
    p_ids BIGINT[],
    p_is_archived BOOLEAN,
    OUT v_auto_adder_id INT
)
AS $$
DECLARE
auto_adder_id BIGINT;
BEGIN
FOR auto_adder_id IN SELECT unnest(p_ids)
LOOP
UPDATE auto_adder ad
SET
    is_archived = p_is_archived,
    updated_at = CURRENT_TIMESTAMP
WHERE ad.id = auto_adder_id;

IF NOT FOUND THEN
            RAISE EXCEPTION 'Record with ID % not found in table', commission_id;
END IF;

        v_auto_adder_id := auto_adder_id;
END LOOP;
END;
$$ LANGUAGE plpgsql;
