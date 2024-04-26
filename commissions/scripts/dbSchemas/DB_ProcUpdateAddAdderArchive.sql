CREATE OR REPLACE FUNCTION update_add_adder_archive(
    p_ids BIGINT[],
    p_is_archived BOOLEAN,
    OUT v_add_adder_id INT
)
AS $$
DECLARE
add_adder_id BIGINT;
BEGIN
FOR add_adder_id IN SELECT unnest(p_ids)
                                LOOP
UPDATE auto_adder
SET
    is_archived = p_is_archived,
    updated_at = CURRENT_TIMESTAMP
WHERE id = add_adder_id;

IF NOT FOUND THEN
            RAISE EXCEPTION 'Record with ID % not found in commission_rates table', commission_id;
END IF;

        v_add_adder_id := add_adder_id;
END LOOP;
END;
$$ LANGUAGE plpgsql;
