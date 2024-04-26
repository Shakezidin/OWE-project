CREATE OR REPLACE FUNCTION update_noncomm_dlr_pay_archive(
    p_ids BIGINT[],
    p_is_archived BOOLEAN,
    OUT v_noncomm_dlr_pay_id INT
)
AS $$
DECLARE
noncomm_dlr_pay_id BIGINT;
BEGIN
FOR noncomm_dlr_pay_id IN SELECT unnest(p_ids)
                                   LOOP
UPDATE noncomm_dlr_pay rd
SET
    is_archived = p_is_archived,
    updated_at = CURRENT_TIMESTAMP
WHERE rd.id = noncomm_dlr_pay_id;

IF NOT FOUND THEN
            RAISE EXCEPTION 'Record with ID % not found in noncomm_dlr_pay table', referral_data_id;
END IF;

        v_noncomm_dlr_pay_id := noncomm_dlr_pay_id;
END LOOP;
END;
$$ LANGUAGE plpgsql;
