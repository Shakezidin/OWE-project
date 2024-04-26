CREATE OR REPLACE FUNCTION update_referral_data_archive(
    p_ids BIGINT[],
    p_is_archived BOOLEAN,
    OUT v_referral_data_id INT
)
AS $$
DECLARE
referral_data_id BIGINT;
BEGIN
FOR referral_data_id IN SELECT unnest(p_ids)
                                 LOOP
UPDATE referral_data rd
SET
    is_archived = p_is_archived,
    updated_at = CURRENT_TIMESTAMP
WHERE rd.id = referral_data_id;

IF NOT FOUND THEN
            RAISE EXCEPTION 'Record with ID % not found in rebate_data table', referral_data_id;
END IF;

        v_referral_data_id := referral_data_id;
END LOOP;
END;
$$ LANGUAGE plpgsql;
