CREATE OR REPLACE FUNCTION update_adder_credit(
    p_id INT,
    p_unique_id               VARCHAR,
    p_pay_scale               VARCHAR,
    p_type                    VARCHAR,
    p_min_rate                DOUBLE PRECISION,
    p_max_rate                DOUBLE PRECISION,
    OUT v_adder_credit_id INT
)
RETURNS INT 
AS $$
BEGIN
    UPDATE adder_credit
    SET 
        unique_id = p_unique_id,
        pay_scale = p_pay_scale,
        type = p_type,
        min_rate = p_min_rate,
        max_rate = p_max_rate,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = p_id
    RETURNING id INTO v_adder_credit_id;
IF NOT FOUND THEN
        RAISE EXCEPTION 'Record with ID % not found in adder_credit table', p_id;
    END IF;

    -- No need for a RETURN statement when using OUT parameters
EXCEPTION
    WHEN OTHERS THEN
        -- Handle the exception, you can log or re-raise as needed
        RAISE EXCEPTION 'Error updating record in adder_credit: %', SQLERRM;
END;
$$ LANGUAGE plpgsql;