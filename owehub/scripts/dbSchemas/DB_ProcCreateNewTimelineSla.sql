CREATE OR REPLACE FUNCTION create_new_timeline_sla(
    p_type_m2m VARCHAR,
    p_state_name VARCHAR,
    p_days INTEGER,
    p_start_date VARCHAR,
    p_end_date VARCHAR,
    OUT v_timeline_sla_id INT
)
RETURNS INT
AS $$
DECLARE
    v_state_id INT;
    v_days_int INT;
BEGIN
    -- Get the state_id based on the provided state_name
    SELECT state_id INTO v_state_id
    FROM states
    WHERE name = p_state_name;

    -- Check if the state exists
    IF v_state_id IS NULL THEN
        RAISE EXCEPTION 'State % not found', p_state_name;
    END IF;

    -- Convert p_days from VARCHAR to INTEGER
    BEGIN
        v_days_int := p_days;
    EXCEPTION
        WHEN others THEN
            RAISE EXCEPTION 'Invalid value for days: %', p_days;
    END;

    -- Insert a new timeline_sla record
    INSERT INTO timeline_sla (
        type_m2m,
        state_id,
        days,
        start_date,
        end_date,
        is_archived
    )
    VALUES (
        p_type_m2m,
        v_state_id,
        v_days_int,
        p_start_date,
        p_end_date,
        FALSE
    )
    RETURNING id INTO v_timeline_sla_id;

END;
$$ LANGUAGE plpgsql;
