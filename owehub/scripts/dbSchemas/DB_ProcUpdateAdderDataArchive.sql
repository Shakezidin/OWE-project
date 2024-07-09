CREATE OR REPLACE FUNCTION update_adder_data_archive(
    p_ids BIGINT[],
    p_is_archived BOOLEAN,
    OUT v_adder_data_id INT
)
AS $$
DECLARE
adder_data_id BIGINT;
BEGIN
FOR adder_data_id IN SELECT unnest(p_ids)
LOOP
UPDATE adder_data
SET
    is_archived = p_is_archived,
    updated_at = CURRENT_TIMESTAMP
WHERE id = adder_data_id;

IF NOT FOUND THEN
            RAISE EXCEPTION 'Record with ID % not found in adder_data table', adder_data_id;
END IF;

        v_adder_data_id := adder_data_id;
END LOOP;
END;
$$ LANGUAGE plpgsql;
