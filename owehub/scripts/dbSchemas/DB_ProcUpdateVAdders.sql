CREATE OR REPLACE FUNCTION update_v_adders(
    p_record_id INT,
    p_adder_name VARCHAR,
    p_adder_type VARCHAR,
    p_price_type VARCHAR,
    p_price_amount VARCHAR,
    p_active INT,
    p_description VARCHAR,
    OUT v_adder_id INT
)
RETURNS INT 
AS $$
BEGIN
    UPDATE v_adders
    SET 
        adder_name = p_adder_name,
        adder_type = p_adder_type,
        price_type = p_price_type,
        price_amount = p_price_amount,
        active = p_active,
        description = p_description,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = p_record_id
    RETURNING id INTO v_adder_id;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Record with ID % not found in v_adders table', p_record_id;
    END IF;

    -- No need for a RETURN statement when using OUT parameters
EXCEPTION
    WHEN OTHERS THEN
        -- Handle the exception, you can log or re-raise as needed
        RAISE EXCEPTION 'Error updating record in v_adders: %', SQLERRM;
END;
$$ LANGUAGE plpgsql;
