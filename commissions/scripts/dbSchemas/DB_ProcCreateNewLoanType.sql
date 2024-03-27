CREATE OR REPLACE FUNCTION create_new_loan_type(
    p_product_code VARCHAR,
    p_active INT,
    p_adder INT,
    p_description VARCHAR,
    OUT loan_type_id INT
) 
RETURNS INT
AS $$
BEGIN
    -- Insert a new record into loan_type table
    INSERT INTO loan_type (
        product_code, 
        active, 
        adder, 
        description)
    VALUES (
        p_product_code,
        p_active,
        p_adder,
        p_description)

    RETURNING id INTO loan_type_id;

END;
$$ LANGUAGE plpgsql;