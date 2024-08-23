ALTER TABLE prospect_load_info
ADD COLUMN missing_labels BOOLEAN;

ALTER TABLE prospects_info
ADD COLUMN added_notes VARCHAR(256);

CREATE OR REPLACE FUNCTION insert_prospect_load_info(
    p_prospect_id INT,
    p_lra NUMERIC,
    p_average_capacity NUMERIC,
    p_continuous_current NUMERIC,
    p_missing_labels BOOLEAN,
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

    -- Insert into prospect_load_info, including the missing_labels column
    INSERT INTO prospect_load_info (prospect_id, lra, average_capacity, continous_current, missing_labels)
    VALUES (p_prospect_id, p_lra, p_average_capacity, p_continuous_current, p_missing_labels)
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

CREATE OR REPLACE FUNCTION create_prospect_info(
    IN prospect_name TEXT,
    IN sr_email_id TEXT,
    IN panel_images_url TEXT[],
    IN water_heater TEXT,
    IN cooking_appliances TEXT,
    IN furnace TEXT,
    IN clothes_dryer TEXT,
    IN pool_pump BOOLEAN,
    IN well_pump BOOLEAN,
    IN ev_charger BOOLEAN,
    IN spa BOOLEAN,
    IN address TEXT,
    IN house_square DOUBLE PRECISION,
    IN sys_size DOUBLE PRECISION,
    IN added_notes  TEXT
)
RETURNS INT
LANGUAGE plpgsql
AS $$
DECLARE
    v_generated_id INT;
BEGIN
/*
    base_id := LOWER(REPLACE(prospect_name, ' ', '_')) || '_' || LOWER(REPLACE(sr_email_id, '@', '_'));  
    generated_id := generate_unique_id(base_id);
*/ 
    INSERT INTO prospects_info (prospect_name, sr_email_id, panel_images_url, water_heater,cooking_appliances, furnace, clothes_dryer, pool_pump, well_pump, ev_charger ,spa, address, house_square,sys_size,added_notes)
    VALUES (prospect_name, sr_email_id, panel_images_url, water_heater,cooking_appliances, furnace, clothes_dryer, pool_pump, well_pump, ev_charger ,spa, address, house_square,sys_size,added_notes)
    RETURNING prospect_id INTO v_generated_id;

    RETURN v_generated_id;

END;
$$;