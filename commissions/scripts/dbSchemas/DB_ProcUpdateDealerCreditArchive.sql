CREATE OR REPLACE FUNCTION update_dealer_credit_archive(
    p_ids BIGINT[],
    p_is_archived BOOLEAN,
    OUT v_dealer_credit_id INT
)
AS $$
DECLARE
dealer_credit_id BIGINT;
BEGIN
FOR dealer_credit_id IN SELECT unnest(p_ids)
LOOP
UPDATE dealer_credit rd
SET
    is_archived = p_is_archived,
    updated_at = CURRENT_TIMESTAMP
WHERE rd.id = dealer_credit_id;

IF NOT FOUND THEN
            RAISE EXCEPTION 'Record with ID % not found in dealer_credit table', referral_data_id;
END IF;

        v_dealer_credit_id := dealer_credit_id;
END LOOP;
END;
$$ LANGUAGE plpgsql;
