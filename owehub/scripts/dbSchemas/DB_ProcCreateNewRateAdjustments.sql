CREATE OR REPLACE FUNCTION create_new_rate_adjustments(
    p_unique_id         CHARACTER VARYING,
    p_pay_scale         CHARACTER VARYING,
    p_position          CHARACTER VARYING,
    p_adjustment        CHARACTER VARYING,
    p_min_rate          DOUBLE PRECISION,
    p_max_rate          DOUBLE PRECISION,
    p_start_date        CHARACTER VARYING,
    p_end_date          CHARACTER VARYING,
    OUT v_rate_adjustment_id INT
)
RETURNS INT
AS $$
BEGIN
INSERT INTO rate_adjustments (
    unique_id,
    pay_scale,
    position,
    adjustment,
    min_rate,
    max_rate,
    start_date,
    end_date
)
VALUES (
           p_unique_id,
           p_pay_scale,
           p_position,
           p_adjustment,
           p_min_rate,
           p_max_rate,
           p_start_date,
           p_end_date
       )
    RETURNING id INTO v_rate_adjustment_id;
END;
$$ LANGUAGE plpgsql;
