CREATE OR REPLACE FUNCTION create_new_dealer(
    p_sub_dealer character varying,
    p_dealer_name character varying,
    p_state_name     character varying,
    p_pay_rate character varying,
    p_start_date date,
    p_end_date date,
    OUT v_dealer_override_id INT
)
RETURNS INT
AS $$
DECLARE
    v_dealer_id INT;
    v_state_id INT;
BEGIN
    -- Check if the dealer exists
    SELECT user_id INTO v_dealer_id
    FROM user_details
    WHERE name = p_dealer_name;

    IF v_dealer_id IS NULL THEN
        RAISE EXCEPTION 'Dealer with name % not found', p_dealer_name;
    END IF;

    SELECT state_id INTO v_state_id
    FROM states
    WHERE name = p_state_name;

    -- Check if the state exists
    IF v_state_id IS NULL THEN
        RAISE EXCEPTION 'State % not found', p_state_name;
    END IF;

    -- Insert new record into dealer_override table
    INSERT INTO dealer_override (
        sub_dealer,
        dealer_id,
        state,
        pay_rate,
        start_date,
        end_date,
        is_archived
    )
    VALUES (
        p_sub_dealer,
        v_dealer_id,  
        v_state_id,
        p_pay_rate,
        p_start_date,
        p_end_date,
        FALSE
    )
    RETURNING id INTO v_dealer_override_id;

END;
$$ LANGUAGE plpgsql;
