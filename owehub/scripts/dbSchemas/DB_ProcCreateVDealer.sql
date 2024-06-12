CREATE OR REPLACE FUNCTION create_v_dealer(
    p_dealer_code VARCHAR,
    p_dealer_name VARCHAR,
    p_description VARCHAR,
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
        is_archived
    )
    VALUES (
        p_dealer_code,
        p_dealer_name,
        p_description,
        FALSE
    )
    RETURNING id INTO v_dealer_id;

END;
$$ LANGUAGE plpgsql;
