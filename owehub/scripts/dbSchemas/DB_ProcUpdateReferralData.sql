CREATE OR REPLACE FUNCTION update_new_referral_data(
    p_id                      INT,
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
    UPDATE referral_data
    SET 
        unique_id = p_unique_id,
        new_customer = p_new_customer,
        referrer_serial = p_referrer_serial,
        referrer_name = p_referrer_name,
        amount = p_amount,
        rep_doll_divby_per = p_rep_doll_divby_per,
        notes = p_notes,
        start_date = p_date
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