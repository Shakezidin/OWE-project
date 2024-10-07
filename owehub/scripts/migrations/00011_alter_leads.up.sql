DELETE FROM leads_info; -- TODO: find a way to preserve data

ALTER TABLE leads_info DROP CONSTRAINT leads_info_zipcode_fkey;
ALTER TABLE leads_info ALTER COLUMN zipcode TYPE VARCHAR(20);

-- CHANGE THE FUNCTION TO INSERT VARCHAR(20) FOR ZIPCODE
CREATE OR REPLACE FUNCTION create_lead(
    p_creator_email_id VARCHAR,
    p_first_name VARCHAR,
    p_last_name VARCHAR,
    p_email_id VARCHAR,
    p_phone_number VARCHAR,
    p_street_address VARCHAR, 
    p_zipcode VARCHAR, 
    p_notes VARCHAR
) RETURNS INT AS $$
DECLARE
    v_lead_id INT;
    v_state_id INT;
    v_creator_user_id INT;
BEGIN
    -- Get the creator user_id via email_id
    SELECT user_id INTO v_creator_user_id
    FROM user_details
    WHERE email_id = p_creator_email_id;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'User with email_id % not found', p_creator_email_id;
    END IF;


    -- Insert into leads_info table 
    INSERT INTO leads_info (
        created_by,
        first_name,
        last_name,
        email_id,
        phone_number,
        street_address,
        zipcode,
        notes
    ) VALUES (
        v_creator_user_id,
        p_first_name,
        p_last_name,
        p_email_id,
        p_phone_number,
        p_street_address,
        p_zipcode, 
        p_notes
    ) RETURNING leads_id INTO v_lead_id;

    -- Return the inserted lead's ID
    RETURN v_lead_id;

    EXCEPTION WHEN unique_violation THEN RAISE EXCEPTION 'EMAIL_OR_PHONE_NO._EXISTS';
END;
$$ LANGUAGE plpgsql;