CREATE OR REPLACE FUNCTION update_new_referral_data(
    p_id                      INT,
    p_unique_id               character varying,
    p_new_customer            character varying,
    p_referrer_serial         character varying,
    p_referrer_name           character varying,
    p_amount                  character varying,
    p_rep_doll_divby_per      float,
    p_notes                   character varying,
    p_type                    character varying,
    p_rep_1_name              character varying,
    p_rep_2_name              character varying,
    p_sys_size                float,
    p_rep_count               float,
    p_state_name              character varying,
    p_per_rep_addr_share      float,
    p_per_rep_ovrd_share      float,
    p_r1_pay_scale            float,
    p_r1_referral_credit      character varying,
    p_r1_referral_credit_perc character varying,
    p_r1_addr_resp            character varying,
    p_r2_pay_scale            float,
    p_r2_referral_credit      character varying,
    p_r2_referral_credit_perc character varying,
    p_r2_addr_resp            character varying,
    p_start_date              character varying,
    p_end_date                character varying,
    OUT v_referral_data_id    INT
)
RETURN INT
AS $$
BEGIN
    UPDATE rebate_data
    SET 
        unique_id = p_unique_id,
        new_customer = p_new_customer,
        referrer_serial = p_referrer_serial,
        referrer_name = p_referrer_name,
        amount = p_amount,
        rep_doll_divby_per = p_rep_doll_divby_per,
        notes = p_notes,
        type = p_type,
        rep_1 = (SELECT user_id FROM user_details WHERE LOWER(name) = LOWER(p_rep_1_name) LIMIT 1),
        rep_2 = (SELECT user_id FROM user_details WHERE LOWER(name) = LOWER(p_rep_2_name) LIMIT 1),
        sys_size = p_sys_size,
        rep_count = p_rep_count,
        state_id = (SELECT state_id FROM states WHERE LOWER(name) = LOWER(p_state_name) LIMIT 1),
        per_rep_addr_share = p_per_rep_addr_share,
        per_rep_ovrd_share = p_per_rep_ovrd_share,
        r1_pay_scale = p_r1_pay_scale,
        r1_referral_credit_$ = p_r1_referral_credit,
        r1_referral_credit_perc = p_r1_referral_credit_perc,
        r1_addr_resp = p_r1_addr_resp,
        r2_pay_scale = p_r2_pay_scale,
        r2_referral_credit_$ = p_r2_referral_credit,
        r2_referral_credit_perc = p_r2_referral_credit_perc,
        r2_addr_resp = p_r2_addr_resp,
        start_date = p_start_date,
        end_date = p_end_date
    WHERE id = p_id
    RETURNING id INTO v_referral_data_id;
IF NOT FOUND THEN
        RAISE EXCEPTION 'Record with ID % not found in referral data table', p_id;
    END IF;

    -- No need for a RETURN statement when using OUT parameters
EXCEPTION
    WHEN OTHERS THEN
        -- Handle the exception, you can log or re-raise as needed
        RAISE EXCEPTION 'Error updating record in referrral: %', SQLERRM;
END;
$$ LANGUAGE plpgsql;