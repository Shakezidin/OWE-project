CREATE OR REPLACE FUNCTION update_loan_fee_adder(
    p_id INT,
    p_unique_id               VARCHAR,
    p_type_mktg               VARCHAR,
    p_dealer                  VARCHAR,
    p_installer               VARCHAR,
    p_state_name              VARCHAR,
    p_contract_amount         DOUBLE PRECISION,
    p_dealer_tier             VARCHAR,
    p_owe_cost                DOUBLE PRECISION,
    p_addr_amount             DOUBLE PRECISION,
    p_per_kw_amount           DOUBLE PRECISION,
    p_rep_doll_divby_per      DOUBLE PRECISION,
    p_description_rep_visible VARCHAR,
    p_notes_not_rep_visible   VARCHAR,
    p_type                    VARCHAR,
    p_rep_1_name              VARCHAR,
    p_rep_2_name              VARCHAR,
    p_sys_size                DOUBLE PRECISION,
    p_rep_count               DOUBLE PRECISION,
    p_per_rep_addr_share      DOUBLE PRECISION,
    p_per_rep_ovrd_share      DOUBLE PRECISION,
    p_r1_pay_scale            DOUBLE PRECISION,
    p_rep_1_def_resp          VARCHAR,
    p_r1_addr_resp            VARCHAR,
    p_r2_pay_scale            DOUBLE PRECISION,
    p_rep_2_def_resp          VARCHAR,
    p_r2_addr_resp            VARCHAR,
    p_start_date              VARCHAR,
    p_end_date                VARCHAR,
    OUT v_loan_fee_adder_id   INT
)
RETURNS INT 
AS $$
BEGIN
    UPDATE loan_fee_adder
    SET 
        unique_id = p_unique_id,
        type_mktg = p_type_mktg,
        dealer_id = (SELECT user_id FROM user_details WHERE LOWER(name) = LOWER(p_dealer) LIMIT 1),
        installer_id = (SELECT partner_id FROM partners WHERE LOWER(partner_name) = LOWER(p_installer) LIMIT 1),
        state_id = (SELECT state_id FROM states WHERE LOWER(name) = LOWER(p_state_name) LIMIT 1),
        contract_dol_dol = p_contract_amount,
        dealer_tier = (SELECT id FROM tier WHERE LOWER(tier_name) = LOWER(p_dealer_tier) LIMIT 1),
        owe_cost = p_owe_cost,
        addr_amount = p_addr_amount,
        per_kw_amount = p_per_kw_amount,
        rep_doll_divby_per = p_rep_doll_divby_per,
        description_rep_visible = p_description_rep_visible,
        notes_not_rep_visible = p_notes_not_rep_visible,
        type = p_type,
        rep_1 = (SELECT user_id FROM user_details WHERE LOWER(name) = LOWER(p_rep_1_name) LIMIT 1),
        rep_2 = (SELECT user_id FROM user_details WHERE LOWER(name) = LOWER(p_rep_2_name) LIMIT 1),
        sys_size = p_sys_size,
        rep_count = p_rep_count,
        per_rep_addr_share = p_per_rep_addr_share,
        per_rep_ovrd_share = p_per_rep_ovrd_share,
        r1_pay_scale = p_r1_pay_scale,
        rep_1_def_resp = p_rep_1_def_resp,
        r1_addr_resp = p_r1_addr_resp,
        r2_pay_scale = p_r2_pay_scale,
        rep_2_def_resp = p_rep_2_def_resp,
        r2_addr_resp = p_r2_addr_resp,
        start_date = p_start_date,
        end_date = p_end_date,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = p_id
    RETURNING id INTO v_loan_fee_adder_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Record with ID % not found in loan_fee_adder table', p_id;
    END IF;

    -- No need for a RETURN statement when using OUT parameters
EXCEPTION
    WHEN OTHERS THEN
        -- Handle the exception, you can log or re-raise as needed
        RAISE EXCEPTION 'Error updating record in loan_fee_adder: %', SQLERRM;
END;
$$ LANGUAGE plpgsql;
