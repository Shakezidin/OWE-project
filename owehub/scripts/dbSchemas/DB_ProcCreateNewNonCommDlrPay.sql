CREATE OR REPLACE FUNCTION create_new_non_comm_dlr_pay(
    p_unique_id character varying,
    p_customer   text,
    p_dealer_name text,
    p_dealer_dba  text,
    p_exact_amount  text,
    p_approved_by text,
    p_notes text,
    p_balance  float,
    p_paid_amount  float,
    p_dba  text,
    p_start_date character varying,
    p_end_date character varying,
    OUT v_non_comm_dlr_pay_id INT
)
    RETURNS INT
AS $$
DECLARE
    v_dealer_id INT;
BEGIN
    -- Retrieve the user_id for the given dealer_name
    SELECT user_id INTO v_dealer_id
    FROM user_details
    WHERE name = p_dealer_name;

    -- Check if the dealer_id exists
    IF v_dealer_id IS NULL THEN
        RAISE EXCEPTION 'Dealer with name % not found', p_dealer_name;
    END IF;

    -- Insert data into noncomm_dlrpay table
    INSERT INTO noncomm_dlrpay (
        unique_id,
        customer,
        dealer_id,
        dealer_dba,
        exact_amount,
        approved_by,
        notes,
        balance,
        paid_amount,
        dba,
        start_date,
        end_date
    )
    VALUES (
               p_unique_id,
               p_customer,
               v_dealer_id,
               p_dealer_dba,
               p_exact_amount,
               p_approved_by,
               p_notes,
               p_balance,
               p_paid_amount,
               p_dba,
               p_start_date,
               p_end_date
           )
    RETURNING id INTO v_non_comm_dlr_pay_id;
END;
$$ LANGUAGE plpgsql;
