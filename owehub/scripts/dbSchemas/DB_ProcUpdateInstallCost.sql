CREATE OR REPLACE FUNCTION update_install_cost (
    p_id INT,
    p_cost DOUBLE PRECISION,
    p_start_date date,
	p_end_date date,
    OUT v_install_cost_id INT
)
RETURNS INT 
AS $$
BEGIN
  UPDATE install_cost
    SET 
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