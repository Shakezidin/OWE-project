CREATE OR REPLACE FUNCTION create_v_dealer(
    p_dealer_code VARCHAR,
    p_dealer_name VARCHAR,
    p_description VARCHAR,
    p_dealer_logo VARCHAR,
    p_bg_colour VARCHAR,
    OUT v_dealer_id INT
)
RETURNS INT
AS $$
BEGIN
    -- Insert a new v_dealer into v_dealers table
    INSERT INTO v_dealer (
        dealer_code,
        dealer_name,
        description,
        dealer_logo,
        bg_colour,
        is_archived
    )
    VALUES (
        p_dealer_code,
        p_dealer_name,
        p_description,
        p_dealer_logo,
        p_bg_colour,
        FALSE
    )
    RETURNING id INTO v_dealer_id;

END;
$$ LANGUAGE plpgsql;
