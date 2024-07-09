CREATE OR REPLACE FUNCTION update_loan_fee_archive(
    p_ids BIGINT[],
    p_is_archived BOOLEAN,
    OUT v_loan_fee_id BIGINT
)
AS $$
DECLARE
    loan_fee_id BIGINT;
BEGIN
    FOR loan_fee_id IN SELECT unnest(p_ids)
    LOOP
        UPDATE loan_fee lf
        SET
            is_archived = p_is_archived,
            updated_at = CURRENT_TIMESTAMP
        WHERE lf.id = loan_fee_id;

        IF NOT FOUND THEN
            RAISE EXCEPTION 'Record with ID % not found in loan_fee table', loan_fee_id;
        END IF;

        v_loan_fee_id := loan_fee_id;
    END LOOP;
END;
$$ LANGUAGE plpgsql;
