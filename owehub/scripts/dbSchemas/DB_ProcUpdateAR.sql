CREATE OR REPLACE FUNCTION update_ar(
    p_id INT,
    p_unique_id                VARCHAR,
    p_pay_scale                VARCHAR,
    p_position                 VARCHAR,
    p_adjustment               VARCHAR,
    p_min_rate                 DOUBLE PRECISION,
    p_max_rate                 DOUBLE PRECISION,
    OUT v_ar_id INT
)
RETURNS INT 
AS $$
BEGIN
    UPDATE ar
    SET 
        unique_id = p_unique_id,
        pay_scale  = p_pay_scale,
        position = p_position,
        adjustment = p_adjustment,
        min_rate = p_min_rate,
        max_rate = p_max_rate,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = p_id
    RETURNING id INTO v_ar_id;
IF NOT FOUND THEN
        RAISE EXCEPTION 'Record with ID % not found in ar table', p_id;
    END IF;

    -- No need for a RETURN statement when using OUT parameters
EXCEPTION
    WHEN OTHERS THEN
        -- Handle the exception, you can log or re-raise as needed
        RAISE EXCEPTION 'Error updating record in ar: %', SQLERRM;
END;
$$ LANGUAGE plpgsql;