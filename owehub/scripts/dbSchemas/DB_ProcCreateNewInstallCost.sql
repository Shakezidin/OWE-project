CREATE OR REPLACE FUNCTION create_new_install_cost(
    p_unique_id               CHARACTER VARYING,
    p_cost                    DOUBLE PRECISION,
    p_start_date              CHARACTER VARYING,
    p_end_date                CHARACTER VARYING,
    OUT v_install_cost_id     INT
)
RETURNS INT
AS $$
BEGIN
    INSERT INTO install_cost (
    unique_id,
    cost,
    start_date,
    end_date
)
VALUES (
           p_unique_id,
           p_cost,
           p_start_date,
           p_end_date
       )
    RETURNING id INTO v_install_cost_id;
END;
$$ LANGUAGE plpgsql;