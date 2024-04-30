CREATE OR REPLACE FUNCTION create_new_loan_fee(
    p_unique_id               character varying,
    p_dealer                  character varying,
    p_installer               character varying,
    p_state_name              character varying,
    p_loan_type               character varying,
    p_owe_cost                double precision,
    p_dlr_mu                  character varying,
    p_dlr_cost                character varying,
    p_start_date              character varying,
    p_end_date                character varying,
    OUT v_loan_fee_id         INT
)
RETURNS INT
AS $$
DECLARE
    v_dealer_id INT;
    v_installer_id INT;
    v_state_id INT;
    v_loan_type_id INT;
BEGIN
    SELECT user_id INTO v_dealer_id
    FROM user_details
    WHERE name = p_dealer;

    -- Check if the user exists
    IF v_dealer_id IS NULL THEN
        RAISE EXCEPTION 'User % not found', p_dealer;
    END IF;

    SELECT partner_id INTO v_installer_id
    FROM partners
    WHERE partner_name = p_installer;

    -- Check if the user exists
    IF v_installer_id IS NULL THEN
        RAISE EXCEPTION 'Installer % not found', p_installer;
    END IF;

    -- Get the state_id based on the provided state_name
    SELECT state_id INTO v_state_id
    FROM states
    WHERE name = p_state_name;

    -- Check if the state exists
    IF v_state_id IS NULL THEN
        RAISE EXCEPTION 'State % not found', p_state_name;
    END IF;

    -- Get the state_id based on the provided state_name
    SELECT id INTO v_loan_type_id
    FROM loan_type
    WHERE product_code = p_loan_type;

    -- Check if the state exists
    IF v_loan_type_id IS NULL THEN
        RAISE EXCEPTION 'Loan type % not found', p_loan_type;
    END IF;

    INSERT INTO loan_fee(
        unique_id,
        dealer_id,
        installer,
        state_id,
        loan_type,
        owe_cost,
        dlr_mu,
        dlr_cost,
        is_archived,
        start_date,
        end_date
    )
    VALUES (
        p_unique_id,
        v_dealer_id,
        v_installer_id,
        v_state_id,
        v_loan_type_id,
        p_owe_cost,
        p_dlr_mu,
        p_dlr_cost,
        FALSE,
        p_start_date,
        p_end_date
    )
    RETURNING id INTO v_loan_fee_id;

END;
$$ LANGUAGE plpgsql;
