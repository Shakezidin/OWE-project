CREATE OR REPLACE FUNCTION create_new_vadders(
    p_adder_name VARCHAR,
    p_adder_type VARCHAR,
    p_price_type VARCHAR,
    p_price_amount FLOAT,
    p_active INT,
    p_description VARCHAR,
    OUT v_adder_id INT
)
RETURNS INT
AS $$
BEGIN
    -- Insert a new v_adder into v_adders table
    INSERT INTO v_adders (
        adder_name,
        adder_type,
        price_type,
        price_amount,
        active,
        description
    )
    VALUES (
        p_adder_name,
        p_adder_type,
        p_price_type,
        p_price_amount,
        p_active,
        p_description
    )
    RETURNING id INTO v_adder_id;

END;
$$ LANGUAGE plpgsql;
