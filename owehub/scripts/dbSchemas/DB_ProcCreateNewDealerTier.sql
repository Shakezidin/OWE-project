CREATE OR REPLACE FUNCTION create_new_dealer_tier(
    p_dealer_name character varying,
    p_tier_name character varying,
    p_start_date character varying,
    p_end_date character varying,
    OUT v_dealer_override_id INT
)
RETURNS INT
AS $$
DECLARE
    v_dealer_id INT;
    v_tier_id INT;
BEGIN
    -- Check if the dealer exists
    SELECT user_id INTO v_dealer_id
    FROM user_details
    WHERE name = p_dealer_name;

    IF v_dealer_id IS NULL THEN
        RAISE EXCEPTION 'Dealer with name % not found', p_dealer_name;
    END IF;

    -- Get the tier_id based on the provided tier_name
    SELECT id INTO v_tier_id
    FROM tier
    WHERE tier_name = p_tier_name;

    IF v_tier_id IS NULL THEN
        RAISE EXCEPTION 'Tier with name % not found', p_tier_name;
    END IF;

    -- Insert new record into dealer_tier table
    INSERT INTO dealer_tier (
        dealer_id,
        tier_id,
        start_date,
        end_date,
        is_archived
    )
    VALUES (
        v_dealer_id,
        v_tier_id,
        p_start_date,
        p_end_date,
        FALSE
    )
    RETURNING id INTO v_dealer_override_id;

END;
$$ LANGUAGE plpgsql;
