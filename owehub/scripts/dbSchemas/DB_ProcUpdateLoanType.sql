CREATE OR REPLACE FUNCTION update_loan_type(
    p_record_id INT,
    p_product_code VARCHAR,
    p_active INT,
    p_adder INT,
    p_description VARCHAR,
    OUT v_loan_type_id INT
)
RETURNS INT 
AS $$
BEGIN
    UPDATE loan_type
    SET 
        product_code = p_product_code,
        active = p_active,
        adder = p_adder,
        description = p_description,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = p_record_id
    RETURNING id INTO v_loan_type_id;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Record with ID % not found in loan_type table', p_record_id;
    END IF;

EXCEPTION
    WHEN OTHERS THEN
        -- Handle the exception, you can log or re-raise as needed
        RAISE EXCEPTION 'Error updating record in loan_type: %', SQLERRM;
END;
$$ LANGUAGE plpgsql;
