CREATE OR REPLACE FUNCTION update_adder_responsibility(
    p_id INT,
    p_pay_scale               VARCHAR,
    p_percentage              DOUBLE PRECISION,
    OUT v_adder_responsibility_id INT
)
RETURNS INT 
AS $$
BEGIN
    UPDATE adder_responsibility
    SET 
        pay_scale = p_pay_scale,
        percentage = p_percentage,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = p_id
    RETURNING id INTO v_adder_responsibility_id;
IF NOT FOUND THEN
        RAISE EXCEPTION 'Record with ID % not found in adder_responsibility table', p_id;
    END IF;

    -- No need for a RETURN statement when using OUT parameters
EXCEPTION
    WHEN OTHERS THEN
        -- Handle the exception, you can log or re-raise as needed
        RAISE EXCEPTION 'Error updating record in adder_responsibility: %', SQLERRM;
END;
$$ LANGUAGE plpgsql;