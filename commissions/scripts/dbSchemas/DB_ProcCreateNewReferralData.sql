CREATE OR REPLACE FUNCTION create_new_referral_data(
    id serial NOT NULL,
    unique_id varchar NOT NULL UNIQUE,
    new_customer text,
    referrer_serial text,
    referrer_name text,
    amount text,
    rep_doll_divby_per float,
    OUT v_referral_data_id INT
)
RETURN INT
AS $$
DECLARE
