CREATE OR REPLACE FUNCTION update_adder_credit_archive(
    p_ids BIGINT[],
    p_is_archived BOOLEAN,
    OUT v_adder_credit_id INT
)
AS $$
DECLARE
adder_credit_id BIGINT;
BEGIN
FOR adder_credit_id IN SELECT unnest(p_ids)
LOOP
UPDATE adder_credit ad
SET
    is_archived = p_is_archived,
    updated_at = CURRENT_TIMESTAMP
WHERE ad.id = adder_credit_id;

IF NOT FOUND THEN
            RAISE EXCEPTION 'Record with ID % not found in adder_credit table', adder_credit_id;
END IF;

        v_adder_credit_id := adder_credit_id;
END LOOP;
END;
$$ LANGUAGE plpgsql;
