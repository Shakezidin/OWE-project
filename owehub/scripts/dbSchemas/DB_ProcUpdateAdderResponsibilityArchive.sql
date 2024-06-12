CREATE OR REPLACE FUNCTION update_adder_responsibility_archive(
    p_ids BIGINT[],
    p_is_archived BOOLEAN,
    OUT v_adder_responsibility_id INT
)
AS $$
DECLARE
adder_responsibility_id BIGINT;
BEGIN
FOR adder_responsibility_id IN SELECT unnest(p_ids)
LOOP
UPDATE adder_responsibility ad
SET
    is_archived = p_is_archived,
    updated_at = CURRENT_TIMESTAMP
WHERE ad.id = adder_responsibility_id;

IF NOT FOUND THEN
            RAISE EXCEPTION 'Record with ID % not found in adder_responsibility table', adder_responsibility_id;
END IF;

        v_adder_responsibility_id := adder_responsibility_id;
END LOOP;
END;
$$ LANGUAGE plpgsql;
