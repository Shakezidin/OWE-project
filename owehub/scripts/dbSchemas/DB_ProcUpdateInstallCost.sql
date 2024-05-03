CREATE OR REPLACE FUNCTION update_install_cost (
    p_id INT,
    p_unique_id           VARCHAR,
    p_cost DOUBLE PRECISION,
    p_start_date              VARCHAR,
	  p_end_date                VARCHAR,
    OUT v_install_cost_id INT
)
RETURNS INT 
AS $$
BEGIN
  UPDATE install_cost
    SET 
        unique_id = p_unique_id,
        cost = p_cost,
        start_date = p_start_date,
        end_date = p_end_date  
    WHERE id = p_id
    RETURNING id INTO v_install_cost_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Record with ID % not found in install cost table', p_id;
    END IF;

EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error updating record in install cost: %', SQLERRM;
END;
$$ LANGUAGE plpgsql;