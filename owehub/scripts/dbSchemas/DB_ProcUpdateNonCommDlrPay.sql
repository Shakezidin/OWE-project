CREATE OR REPLACE FUNCTION update_non_comm_dlr_pay(
    p_id               INT,
    p_unique_id        VARCHAR,
    p_customer         VARCHAR,
    p_dealer_name      VARCHAR,
    p_dealer_dba       VARCHAR,
    p_exact_amount     DOUBLE PRECISION,
    p_approved_by      VARCHAR,
    p_notes            VARCHAR,
    p_balance          DOUBLE PRECISION,
    p_paid_amount      DOUBLE PRECISION,
    p_dba              VARCHAR,
    p_date             VARCHAR,
    OUT v_non_comm_dlr_pay_id INT
)
RETURNS INT
AS $$
DECLARE
    v_dealer_id INT;
BEGIN
    -- Retrieve the user_id for the given dealer_id
    SELECT id INTO v_dealer_id
    FROM v_dealer
    WHERE dealer_name = p_dealer_name;

    -- -- Check if the dealer_id exists
    -- IF v_dealer_id IS NULL THEN
    --     RAISE EXCEPTION 'Dealer with name % not found', p_dealer_name;
    -- END IF;

    -- Update data in noncomm_dlrpay table
    UPDATE noncomm_dlrpay
    SET
        unique_id = p_unique_id,
        customer = p_customer,
        dealer_id = v_dealer_id,
        dealer_dba = p_dealer_dba,
        exact_amount = p_exact_amount,
        approved_by = p_approved_by,
        notes = p_notes,
        balance = p_balance,
        paid_amount = p_paid_amount,
        dba = p_dba,
        date = p_date
    WHERE
        id = p_id
    RETURNING id INTO v_non_comm_dlr_pay_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Record with ID % not found in non_comm_dlr_pay table', p_id;
    END IF;

    -- No need for a RETURN statement when using OUT parameters
EXCEPTION
    WHEN OTHERS THEN
        -- Handle the exception, you can log or re-raise as needed
        RAISE EXCEPTION 'Error updating record in non_comm_dlr_pay: %', SQLERRM;
END;
$$ LANGUAGE plpgsql;
