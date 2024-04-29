CREATE OR REPLACE FUNCTION create_new_dealer(
    p_sub_dealer character varying,
    p_dealer_name character varying,
    p_pay_rate character varying,
    p_start_date character varying,
    p_end_date character varying,
    OUT v_dealer_override_id INT
)
RETURNS INT
AS $$
DECLARE
    v_dealer_id INT;
BEGIN
    -- Check if the dealer exists
    SELECT user_id INTO v_dealer_id
    FROM user_details
    WHERE name = p_dealer_name;

    IF v_dealer_id IS NULL THEN
        RAISE EXCEPTION 'Dealer with name % not found', p_dealer_name;
    END IF;

    -- Insert new record into dealer_override table
    INSERT INTO dealer_override (
        sub_dealer,
        dealer_id,
        pay_rate,
        start_date,
        end_date,
        is_archived
    )
    VALUES (
        p_sub_dealer,
        v_dealer_id,  
        p_pay_rate,
        p_start_date,
        p_end_date,
        FALSE
    )
    RETURNING id INTO v_dealer_override_id;

END;
$$ LANGUAGE plpgsql;
