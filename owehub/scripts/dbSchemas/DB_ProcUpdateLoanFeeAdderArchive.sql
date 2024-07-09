CREATE OR REPLACE FUNCTION update_loan_fee_adder_archive(
    p_ids BIGINT[],
    p_is_archived BOOLEAN,
    OUT v_loan_fee_adder_id INT
)
AS $$
DECLARE
    loan_fee_adder_id_loop BIGINT;
BEGIN
    FOR loan_fee_adder_id_loop IN SELECT unnest(p_ids)
    LOOP
        UPDATE loan_fee_adder lfa
        SET
            is_archived = p_is_archived,
            updated_at = CURRENT_TIMESTAMP
        WHERE lfa.id = loan_fee_adder_id_loop;

        IF NOT FOUND THEN
            RAISE EXCEPTION 'Record with ID % not found in loan_fee_adder table', loan_fee_adder_id_loop;
        END IF;

        v_loan_fee_adder_id := loan_fee_adder_id_loop;
    END LOOP;
END;
$$ LANGUAGE plpgsql;
