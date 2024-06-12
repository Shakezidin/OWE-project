CREATE OR REPLACE FUNCTION create_new_loan_fee_adder(
    p_unique_id               character varying,
    p_type_mktg               character varying,
    p_dealer                  character varying,
    p_installer               character varying,
    p_state_name              character varying,
    p_contract_amount         double precision,
    p_dealer_tier             character varying,
    p_owe_cost                double precision,
    p_addr_amount             double precision,
    p_per_kw_amount           double precision,
    p_rep_doll_divby_per      double precision,
    p_description_rep_visible character varying,
    p_notes_not_rep_visible   character varying,
    p_type                    character varying,
    p_rep_1_name              character varying,
    p_rep_2_name              character varying,
    p_sys_size                double precision,
    p_rep_count               double precision,
    p_per_rep_addr_share      double precision,
    p_per_rep_ovrd_share      double precision,
    p_r1_pay_scale            double precision,
    p_rep_1_def_resp          character varying,
    p_r1_addr_resp            character varying,
    p_r2_pay_scale            double precision,
    p_rep_2_def_resp          character varying,
    p_r2_addr_resp            character varying,
    p_start_date              character varying,
    p_end_date                character varying,
    OUT v_loan_fee_adder_id   INT
)
RETURNS INT 
AS $$
DECLARE
    v_rep_1_id     INT;
    v_rep_2_id     INT;
    v_state_id     INT;
    v_dealer_id    INT;
    v_installer_id INT;
    v_dealer_tier_id INT;
BEGIN
    -- Get the user_id based on the provided p_rep_1_name
    SELECT user_id INTO v_rep_1_id
    FROM user_details
    WHERE name = p_rep_1_name;

    -- Check if the user exists
    IF v_rep_1_id IS NULL THEN
        RAISE EXCEPTION 'User % not found', p_rep_1_name;
    END IF;

    -- Get the user_id based on the provided p_rep_2_name
    SELECT user_id INTO v_rep_2_id
    FROM user_details
    WHERE name = p_rep_2_name;

    -- Check if the user exists
    IF v_rep_2_id IS NULL THEN
        RAISE EXCEPTION 'User % not found', p_rep_2_name;
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
    SELECT id INTO v_dealer_id
    FROM v_dealer
    WHERE dealer_name = p_dealer;

    -- Check if the state exists
    IF v_dealer_id IS NULL THEN
        RAISE EXCEPTION 'dealer % not found', p_dealer;
    END IF;

    -- Get the state_id based on the provided state_name
    SELECT partner_id INTO v_installer_id
    FROM partners
    WHERE partner_name = p_installer;

    -- Check if the state exists
    IF v_installer_id IS NULL THEN
        RAISE EXCEPTION 'installer % not found', p_installer;
    END IF;

    -- Get the state_id based on the provided state_name
    SELECT id INTO v_dealer_tier_id
    FROM tier
    WHERE tier_name = p_dealer_tier;

    -- Check if the state exists
    IF v_dealer_tier_id IS NULL THEN
        RAISE EXCEPTION 'tier name % not found', p_dealer_tier;
    END IF;

    -- Insert a new loan_fee_adder into loan_fee_adder table
    INSERT INTO loan_fee_adder (
        unique_id,
        type_mktg,
        dealer_id,
        installer_id,
        state_id,
        contract_dol_dol,
        dealer_tier,
        owe_cost,
        addr_amount,
        per_kw_amount,
        rep_doll_divby_per,
        description_rep_visible,
        notes_not_rep_visible,
        type,
        rep_1,
        rep_2,
        sys_size,
        rep_count,
        per_rep_addr_share,
        per_rep_ovrd_share,
        r1_pay_scale,
        rep_1_def_resp,
        r1_addr_resp,
        r2_pay_scale,
        rep_2_def_resp,
        r2_addr_resp,
        start_date,
        end_date
    )
    VALUES (
        p_unique_id,
        p_type_mktg,
        v_dealer_id,
        v_installer_id,
        v_state_id,
        p_contract_amount,
        v_dealer_tier_id,
        p_owe_cost,
        p_addr_amount,
        p_per_kw_amount,
        p_rep_doll_divby_per,
        p_description_rep_visible,
        p_notes_not_rep_visible,
        p_type,
        v_rep_1_id,
        v_rep_2_id,
        p_sys_size,
        p_rep_count,
        p_per_rep_addr_share,
        p_per_rep_ovrd_share,
        p_r1_pay_scale,
        p_rep_1_def_resp,
        p_r1_addr_resp,
        p_r2_pay_scale,
        p_rep_2_def_resp,
        p_r2_addr_resp,
        p_start_date,
        p_end_date
    )
    RETURNING id INTO v_loan_fee_adder_id;

END;
$$ LANGUAGE plpgsql;
