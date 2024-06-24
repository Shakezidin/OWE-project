/*
CREATE OR REPLACE FUNCTION generate_unique_id(base_id TEXT)
RETURNS TEXT AS $$
DECLARE
    suffix INTEGER := 1;
    new_id TEXT;
BEGIN
    LOOP
        new_id := base_id || '_' || suffix;
        
        IF NOT EXISTS (SELECT 1 FROM prospects_info WHERE unique_id = new_id) THEN
            RETURN new_id;
        END IF;
        
        suffix := suffix + 1;
    END LOOP;
END;
$$ LANGUAGE plpgsql;
*/

CREATE OR REPLACE FUNCTION create_prospect_info(
    IN prospect_name TEXT,
    IN sr_email_id TEXT,
    IN panel_images_url TEXT[]
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
    INSERT INTO prospects_info (prospect_name, sr_email_id, panel_images_url)
    VALUES (prospect_name, sr_email_id, panel_images_url)
    RETURNING prospect_id INTO v_generated_id;

    RETURN v_generated_id;

END;
$$;
