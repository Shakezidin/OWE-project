CREATE OR REPLACE FUNCTION create_new_referral_data(
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
    p_r1_referral_credit_$    character varying,
    p_r1_referral_credit_perc character varying,
    p_r1_addr_resp            character varying,
    p_r2_pay_scale            float,
    p_r2_referral_credit_$    character varying,
    p_r2_referral_credit_perc character varying,
    p_r2_addr_resp            character varying,
    p_start_date              character varying,
    p_end_date                character varying,
    OUT v_referral_data_id    INT
)
RETURN INT
AS $$
DECLARE
    v_rep_1_id INT;
    v_rep_2_id INT;
    v_state_id INT;
BEGIN
    -- Fetch rep_1_id
SELECT user_id INTO v_rep_1_id
FROM user_details
WHERE name = p_rep_1_name;

-- Check if rep_1 exists
IF v_rep_1_id IS NULL THEN
        RAISE EXCEPTION 'user % not found', p_rep_1_name;
END IF;

    -- Fetch rep_2_id
SELECT user_id INTO v_rep_2_id
FROM user_details
WHERE name = p_rep_2_name;

-- Check if rep_2 exists
IF v_rep_2_id IS NULL THEN
        RAISE EXCEPTION 'user % not found', p_rep_2_name;
END IF;

    -- Fetch state_id
SELECT state_id INTO v_state_id
FROM states
WHERE name = p_state_name;

-- Check if state exists
IF v_state_id IS NULL THEN
        RAISE EXCEPTION 'state % not found', p_state_name;
END IF;

    -- Insert data into referral_data table
INSERT INTO referral_data (
    unique_id,
    new_customer,
    referrer_serial,
    referrer_name,
    amount,
    rep_doll_divby_per,
    notes,
    type,
    rep_1,
    rep_2,
    sys_size,
    rep_count,
    state_id,
    per_rep_addr_share,
    per_rep_ovrd_share,
    r1_pay_scale,
    r1_referral_credit_$,
    r1_referral_credit_perc,
    r1_addr_resp,
    r2_pay_scale,
    r2_referral_credit_$,
    r2_referral_credit_perc,
    r2_addr_resp,
    start_date,
    end_date
)
VALUES (
   p_unique_id,
   p_new_customer,
   p_referrer_serial,
   p_referrer_name,
   p_amount,
   p_rep_doll_divby_per,
   p_notes,
   p_type,
   v_rep_1_id,
   v_rep_2_id,
   p_sys_size,
   p_rep_count,
   v_state_id,
   p_per_rep_addr_share,
   p_per_rep_ovrd_share,
   p_r1_pay_scale,
   p_r1_referral_credit_$,
   p_r1_referral_credit_perc,
   p_r1_addr_resp,
   p_r2_pay_scale,
   p_r2_referral_credit_$,
   p_r2_referral_credit_perc,
   p_r2_addr_resp,
   p_start_date,
   p_end_date
)
RETURNING id INTO v_referral_data_id;
END;
$$ LANGUAGE plpgsql;
