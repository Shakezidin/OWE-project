CREATE OR REPLACE FUNCTION update_sale_type(
    p_record_id INT,
    p_type_name VARCHAR,
    p_description VARCHAR,
    OUT v_type_id INT
)
RETURNS INT 
AS $$
BEGIN
    UPDATE sale_type
    SET 
        type_name = p_type_name,
        description = p_description,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = p_record_id
    RETURNING id INTO v_type_id;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Record with ID % not found in sale_type table', p_record_id;
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error updating record in sale_type: %', SQLERRM;
END;
$$ LANGUAGE plpgsql;
