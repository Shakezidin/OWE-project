CREATE OR REPLACE FUNCTION insert_prospect_load_info(
    p_prospect_id INT,
    p_lra NUMERIC,
    p_average_capacity NUMERIC,
    p_continuous_current NUMERIC,
    p_missi
    p_breakers_info JSONB
) RETURNS INT AS $$
DECLARE
    v_prospect_load_id INT;
    v_breaker_id INT;
    breaker_record JSONB;
    v_prospect_id INT;
BEGIN
    -- Check if prospect_id exists in prospects_info
    SELECT prospect_id INTO v_prospect_id 
    FROM prospects_info WHERE prospect_id = p_prospect_id;

    IF v_prospect_id IS NULL THEN
        RAISE EXCEPTION 'Prospect with ID % does not exist', p_prospect_id;
    END IF;

    -- Insert into prospect_load_info
    INSERT INTO prospect_load_info (prospect_id, lra, average_capacity, continous_current)
    VALUES (p_prospect_id, p_lra, p_average_capacity, p_continuous_current)
    RETURNING prospect_load_id INTO v_prospect_load_id;

    -- Insert breaker_info records and link them in prospect_load_breakers
    FOR breaker_record IN SELECT * FROM jsonb_array_elements(p_breakers_info) LOOP
        -- Extract category JSON object
        WITH category_data AS (
            SELECT 
                (breaker_record->'category')::jsonb AS category_json
        )
        INSERT INTO breaker_info (ampere, category_name, category_ampere, note)
        VALUES (
            (breaker_record->>'ampere')::NUMERIC,
            (SELECT category_json->>'name' FROM category_data),
            (SELECT (category_json->>'ampere')::NUMERIC FROM category_data),
            breaker_record->>'note'
        )
        RETURNING breaker_id INTO v_breaker_id;

        INSERT INTO prospect_load_breakers (prospect_load_id, breaker_id)
        VALUES (v_prospect_load_id, v_breaker_id);
    END LOOP;

    RETURN v_prospect_load_id;
END;
$$ LANGUAGE plpgsql;