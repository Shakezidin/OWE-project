CREATE OR REPLACE FUNCTION update_loan_fee(
    p_id INT,
    p_dealer                  VARCHAR,
    p_installer               VARCHAR,
    p_state_name              VARCHAR,
    p_loan_type               VARCHAR,
    p_owe_cost                DOUBLE PRECISION,
    p_dlr_mu                  DOUBLE PRECISION,
    p_dlr_cost                DOUBLE PRECISION,
    p_start_date              Date,
    p_end_date                Date,
    OUT v_loan_fee_id INT
)
RETURNS INT 
AS $$
BEGIN
    UPDATE loan_fee
    SET 
        dealer_id = (SELECT id FROM v_dealer WHERE LOWER(dealer_name) = LOWER(p_dealer) LIMIT 1),
        installer = (SELECT partner_id FROM partners WHERE LOWER(partner_name) = LOWER(p_installer) LIMIT 1),
        state_id = (SELECT state_id FROM states WHERE LOWER(name) = LOWER(p_state_name) LIMIT 1),
        loan_type = (SELECT id FROM loan_type WHERE LOWER(product_code) = LOWER(p_loan_type) LIMIT 1),
        owe_cost = p_owe_cost,
        dlr_mu = p_dlr_mu,
        dlr_cost = p_dlr_cost,
        start_date = p_start_date,
        end_date = p_end_date,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = p_id
    RETURNING id INTO v_loan_fee_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Record with ID % not found in loan_fee table', p_id;
    END IF;

    -- No need for a RETURN statement when using OUT parameters
EXCEPTION
    WHEN OTHERS THEN
        -- Handle the exception, you can log or re-raise as needed
        RAISE EXCEPTION 'Error updating record in loan_fee: %', SQLERRM;
END;
$$ LANGUAGE plpgsql;
