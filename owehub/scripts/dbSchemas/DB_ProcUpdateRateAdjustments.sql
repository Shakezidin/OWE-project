CREATE OR REPLACE FUNCTION update_rate_adjustments(
    p_id INT,
    p_pay_scale VARCHAR,
    p_position VARCHAR,
    p_adjustment VARCHAR,
    p_min_rate DOUBLE PRECISION,
    p_max_rate DOUBLE PRECISION,
    OUT v_rate_adjustments_id INT
)
RETURNS INT 
AS $$
BEGIN
    UPDATE rate_adjustments
    SET 
        pay_scale = p_pay_scale,
        position = p_position,
        adjustment = p_adjustment,
        min_rate = p_min_rate,
        max_rate = p_max_rate
    WHERE id = p_id
    RETURNING id INTO v_rate_adjustments_id;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Record with ID % not found in rate_adjustments table', p_id;
    END IF;

EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error updating record in rate_adjustments: %', SQLERRM;
END;
$$ LANGUAGE plpgsql;
