CREATE OR REPLACE FUNCTION create_new_referral_data(
    p_unique_id               character varying,
    p_new_customer            character varying,
    p_referrer_serial         character varying,
    p_referrer_name           character varying,
    p_amount                  float,
    p_rep_doll_divby_per      float,
    p_notes                   character varying,
    p_date                    character varying,
    OUT v_referral_data_id    INT
)
RETURNS INT
AS $$
BEGIN
    -- Insert data into referral_data table
INSERT INTO referral_data (
    unique_id,
    new_customer,
    referrer_serial,
    referrer_name,
    amount,
    rep_doll_divby_per,
    notes,
    start_date
)
VALUES (
   p_unique_id,
   p_new_customer,
   p_referrer_serial,
   p_referrer_name,
   p_amount,
   p_rep_doll_divby_per,
   p_notes,
   p_date
)
RETURNING id INTO v_referral_data_id;
END;
$$ LANGUAGE plpgsql;
