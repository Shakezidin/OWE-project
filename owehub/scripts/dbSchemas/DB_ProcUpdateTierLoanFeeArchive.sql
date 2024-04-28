CREATE OR REPLACE FUNCTION update_tier_loan_fee_archive(
    p_ids BIGINT[],
    p_is_archived BOOLEAN,
    OUT v_tier_loan_fee_id INT
)
AS $$
DECLARE
    tier_loan_fee_id BIGINT;
BEGIN
    FOR tier_loan_fee_id IN SELECT unnest(p_ids)
    LOOP
        UPDATE tier_loan_fee tlf
        SET
            is_archived = p_is_archived,
            updated_at = CURRENT_TIMESTAMP
        WHERE tlf.id = tier_loan_fee_id;

        IF NOT FOUND THEN
            RAISE EXCEPTION 'Record with ID % not found in tier_loan_fee table', tier_loan_fee_id;
        END IF;

        v_tier_loan_fee_id := tier_loan_fee_id;
    END LOOP;
END;
$$ LANGUAGE plpgsql;
