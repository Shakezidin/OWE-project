CREATE OR REPLACE FUNCTION create_new_rep_pay_settings(
    p_name VARCHAR,
    p_state_name VARCHAR,
    p_pay_scale VARCHAR,
    p_position VARCHAR,
    p_b_e BOOLEAN,
    p_start_date DATE,
	p_end_date DATE,
    OUT v_rep_pay_settings_id INT
)
RETURNS INT
AS $$
DECLARE
    v_state_id INT;
    v_pay_id INT;
BEGIN
    -- Get the state_id based on the provided state_name
    SELECT state_id INTO v_state_id
    FROM states
    WHERE name = p_state_name;

    -- Check if the state exists
    IF v_state_id IS NULL THEN
        RAISE EXCEPTION 'State % not found', p_state_name;
    END IF;

    SELECT id INTO v_pay_id
    FROM rep_type
    WHERE rep_type = p_pay_scale;

    -- Check if the state exists
    IF v_pay_id IS NULL THEN
        RAISE EXCEPTION 'rep type % not found', p_pay_scale;
    END IF;

    -- Insert a new v_adder into v_adders table
    INSERT INTO rep_pay_settings (
        name,
        state_id,
        pay_scale,
        position,
        b_e,
        start_date,
        end_date
    )
    VALUES (
        p_name,
        v_state_id,
        v_pay_id,
        p_position,
        p_b_e,
        p_start_date,
        p_end_date
    )
    RETURNING id INTO v_rep_pay_settings_id;

END;
$$ LANGUAGE plpgsql;
