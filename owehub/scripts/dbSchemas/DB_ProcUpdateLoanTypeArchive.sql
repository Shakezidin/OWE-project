CREATE OR REPLACE FUNCTION update_loan_type_archive(
    p_ids BIGINT[],
    p_is_archived BOOLEAN,
    OUT v_loan_type_id INT
)
AS $$
DECLARE
    loan_type_id BIGINT;
BEGIN
    FOR loan_type_id IN SELECT unnest(p_ids)
    LOOP
        UPDATE loan_type ltr
        SET
            is_archived = p_is_archived,
            updated_at = CURRENT_TIMESTAMP
        WHERE ltr.id = loan_type_id;

        IF NOT FOUND THEN
            RAISE EXCEPTION 'Record with ID % not found in loan_type_rates table', loan_type_id;
        END IF;

        v_loan_type_id := loan_type_id;
    END LOOP;
END;
$$ LANGUAGE plpgsql;
