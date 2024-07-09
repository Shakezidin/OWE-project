CREATE OR REPLACE FUNCTION create_tier_loan_fee_type(
    p_dealer_tier VARCHAR,
    p_installer_name VARCHAR,
    p_state_name VARCHAR,
    p_loan_type VARCHAR,
    p_owe_cost DOUBLE PRECISION,
    p_dlr_mu DOUBLE PRECISION,
    p_dlr_cost DOUBLE PRECISION,
    p_start_date date,
    p_end_date date,
    OUT v_tier_loan_fee_id INT
)
RETURNS INT
AS $$
DECLARE
    v_installer_id INT;
    v_state_id INT;
    v_dealer_tier_id INT;
    v_loan_type_id INT;
BEGIN
    -- Get the dealer_tier_id based on the provided dealer_tier name
    SELECT id INTO v_dealer_tier_id
    FROM tier
    WHERE tier_name = p_dealer_tier;

    -- Check if the dealer_tier exists
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Dealer Tier % not found', p_dealer_tier;
    END IF;
    
    -- Get the installer_id based on the provided installer_name
    SELECT partner_id INTO v_installer_id
    FROM partners
    WHERE partner_name = p_installer_name;

    -- Check if the installer exists
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Installer % not found', p_installer_name;
    END IF;

    -- Get the state_id based on the provided state_name
    SELECT state_id INTO v_state_id
    FROM states
    WHERE name = p_state_name;

    -- Check if the state exists
    IF NOT FOUND THEN
        RAISE EXCEPTION 'State % not found', p_state_name;
    END IF;

     -- Get the dealer_tier_id based on the provided dealer_tier name
    SELECT id INTO v_loan_type_id
    FROM loan_type
    WHERE product_code = p_loan_type;

    -- Check if the loan_type exists
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Loan type % not found', p_loan_type;
    END IF;

    -- Insert a new tier_loan_fee record
    INSERT INTO tier_loan_fee (
        dealer_tier,
        installer_id,
        state_id,
        loan_type,
        owe_cost,
        dlr_mu,
        dlr_cost,
        start_date,
        end_date,
        is_archived
    )
    VALUES (
        v_dealer_tier_id,
        v_installer_id,
        v_state_id,
        v_loan_type_id,
        p_owe_cost,
        p_dlr_mu,
        p_dlr_cost,
        p_start_date,
        p_end_date,
        FALSE
    )
    RETURNING id INTO v_tier_loan_fee_id;

END;
$$ LANGUAGE plpgsql;
