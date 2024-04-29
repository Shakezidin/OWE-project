CREATE OR REPLACE FUNCTION update_dealer_override(
    p_record_id INT,
    p_sub_dealer VARCHAR,
    p_dealer VARCHAR,
    p_pay_rate VARCHAR,
    p_start_date VARCHAR,
    p_end_date VARCHAR,
    OUT v_dealer_override_id INT
)
RETURNS INT  -- Return type matches the OUT parameter type
AS $$
BEGIN
    UPDATE dealer_override
    SET 
        sub_dealer = p_sub_dealer,
        dealer_id = (SELECT user_id FROM user_details WHERE LOWER(name) = LOWER(p_dealer) LIMIT 1),
        pay_rate = p_pay_rate,
        start_date = p_start_date,
        end_date = p_end_date,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = p_record_id
    RETURNING id INTO v_dealer_override_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Record with ID % not found in dealer_override table', p_record_id;
    END IF;

    -- No need for a RETURN statement when using OUT parameters
EXCEPTION
    WHEN OTHERS THEN
        -- Handle the exception, you can log or re-raise as needed
        RAISE EXCEPTION 'Error updating record in dealer_override: %', SQLERRM;
END;
$$ LANGUAGE plpgsql;
