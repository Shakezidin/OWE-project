CREATE OR REPLACE FUNCTION update_rep_credit_archive(
    p_ids BIGINT[],
    p_is_archived BOOLEAN,
    OUT v_rep_credit_id INT
)
AS $$
DECLARE
rep_credit_id BIGINT;
BEGIN
FOR rep_credit_id IN SELECT unnest(p_ids)
LOOP
UPDATE rep_credit ad
SET
    is_archived = p_is_archived,
    updated_at = CURRENT_TIMESTAMP
WHERE ad.id = rep_credit_id;

IF NOT FOUND THEN
            RAISE EXCEPTION 'Record with ID % not found in adder_credit table', rep_credit_id;
END IF;

        v_rep_credit_id := rep_credit_id;
END LOOP;
END;
$$ LANGUAGE plpgsql;
