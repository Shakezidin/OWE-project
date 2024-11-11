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
    p_notes VARCHAR,
    p_sales_rep_name VARCHAR,
    p_lead_source VARCHAR
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
        notes,
        sales_rep_name,
        lead_source
    ) VALUES (
        v_creator_user_id,
        p_first_name,
        p_last_name,
        p_email_id,
        p_phone_number,
        p_street_address,
        p_zipcode, 
        p_notes,
        p_sales_rep_name,
        p_lead_source
    ) RETURNING leads_id INTO v_lead_id;

    -- Return the inserted lead's ID
    RETURN v_lead_id;

    EXCEPTION WHEN unique_violation THEN RAISE EXCEPTION 'EMAIL_OR_PHONE_NO._EXISTS';
END;
$$ LANGUAGE plpgsql;


---- ADD AURORA COLUMNS
ALTER TABLE leads_info ADD COLUMN aurora_project_id VARCHAR(40);
ALTER TABLE leads_info ADD COLUMN aurora_project_name VARCHAR(255);
ALTER TABLE leads_info ADD COLUMN aurora_design_id VARCHAR(40);
ALTER TABLE leads_info ADD COLUMN aurora_proposal_id VARCHAR(40);
ALTER TABLE leads_info ADD COLUMN aurora_proposal_status VARCHAR(40);
ALTER TABLE leads_info ADD COLUMN is_appointment_required BOOLEAN DEFAULT TRUE;
ALTER TABLE leads_info ADD COLUMN aurora_proposal_link VARCHAR(255);
ALTER TABLE leads_info ADD COLUMN proposal_pdf_key VARCHAR(80);
ALTER TABLE leads_info ADD COLUMN aurora_proposal_updated_at TIMESTAMPTZ;



CREATE OR REPLACE FUNCTION update_lead_add_proposal(
    p_leads_id INT,
    p_authenticated_email_id VARCHAR,
    p_aurora_proposal_link VARCHAR,
    p_aurora_proposal_id VARCHAR
) RETURNS INT AS $$
DECLARE
    v_user_id INT;
BEGIN

    
    SELECT user_id INTO v_user_id
    FROM user_details
    WHERE email_id = p_authenticated_email_id;

    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'User with email_id % not found', p_authenticated_email_id;
    END IF;

    
    UPDATE leads_info
    SET
        aurora_proposal_link = p_aurora_proposal_link,
        aurora_proposal_id = p_aurora_proposal_id,
        aurora_proposal_status = 'Created',  
        last_updated_by = v_user_id,
        updated_at = CURRENT_TIMESTAMP,
        proposal_created_date = CURRENT_TIMESTAMP,
        aurora_proposal_updated_at = CURRENT_TIMESTAMP
    WHERE leads_id = p_leads_id;
    
    RETURN 0;

END;
$$ LANGUAGE plpgsql;


-- ADD DOCUSIGN RELATED COLUMNS
ALTER TABLE leads_info ADD COLUMN IF NOT EXISTS docusign_envelope_id VARCHAR(255);
ALTER TABLE leads_info ADD COLUMN IF NOT EXISTS docusign_envelope_completed_at TIMESTAMPTZ;
ALTER TABLE leads_info ADD COLUMN IF NOT EXISTS docusign_envelope_declined_at TIMESTAMPTZ;
ALTER TABLE leads_info ADD COLUMN IF NOT EXISTS docusign_envelope_voided_at TIMESTAMPTZ;
ALTER TABLE leads_info ADD COLUMN IF NOT EXISTS docusign_envelope_sent_at TIMESTAMPTZ;

ALTER TABLE leads_info ADD COLUMN IF NOT EXISTS manual_won_date TIMESTAMPTZ;


-- GET SALES REPS UNDER AUTHENTICATED USER
CREATE OR REPLACE FUNCTION get_salesreps_under(p_email_id VARCHAR)
    RETURNS TABLE(user_id INT, name VARCHAR, role_name VARCHAR) AS $$
DECLARE
    v_user_id INT;
    v_user_name VARCHAR;
    v_dealer_id VARCHAR;
    v_user_role VARCHAR;
BEGIN
    SELECT 
        user_details.user_id, user_details.name, user_details.partner_id, user_roles.role_name 
        INTO v_user_id, v_user_name, v_dealer_id, v_user_role
    FROM user_details
    INNER JOIN user_roles ON user_details.role_id = user_roles.role_id
    WHERE user_details.email_id = p_email_id;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'User with email_id % not found', p_email_id;
    END IF;

    -- Admin role check
    IF v_user_role = 'Admin' THEN
        RETURN QUERY
            SELECT user_details.user_id, user_details.name, user_roles.role_name 
            FROM user_details
            INNER JOIN user_roles 
                ON user_details.role_id = user_roles.role_id
                AND user_roles.role_name IN ('Appointment Setter', 'Finance Admin', 'Sale Representative');

    -- Account Executive or Account Manager check
    ELSIF v_user_role IN ('Account Executive', 'Account Manager') THEN
        RETURN QUERY
            SELECT user_details.user_id, user_details.name, user_roles.role_name 
            FROM user_details
            INNER JOIN sales_partner_dbhub_schema 
                ON user_details.partner_id = sales_partner_dbhub_schema.partner_id
            INNER JOIN user_roles 
                ON user_details.role_id = user_roles.role_id
                AND user_roles.role_name IN ('Appointment Setter', 'Finance Admin', 'Sale Representative')
            WHERE (v_user_role = 'Account Executive' AND sales_partner_dbhub_schema.account_executive = v_user_name)
               OR (v_user_role = 'Account Manager' AND sales_partner_dbhub_schema.account_manager2 = v_user_name);

    -- Dealer Owner and Sub Dealer Owner check
    ELSIF v_user_role IN ('Dealer Owner', 'SubDealer Owner') THEN
        RETURN QUERY
            SELECT user_details.user_id, user_details.name, user_roles.role_name 
            FROM user_details
            INNER JOIN user_roles 
                ON user_details.role_id = user_roles.role_id
                AND user_roles.role_name IN ('Appointment Setter', 'Finance Admin', 'Sale Representative')
            WHERE user_details.partner_id = v_dealer_id;

    -- Regional Manager and Sales Manager check
    ELSIF v_user_role IN ('Regional Manager', 'Sales Manager') THEN
        RETURN QUERY
            WITH RECURSIVE hierarchy AS (
                SELECT user_details.user_id
                FROM user_details
                WHERE user_details.user_id = v_user_id
                UNION
                SELECT user_details.user_id
                FROM user_details  
                INNER JOIN hierarchy ON hierarchy.user_id = user_details.reporting_manager 
            )
            SELECT user_details.user_id, user_details.name, user_roles.role_name 
            FROM user_details
            INNER JOIN hierarchy ON hierarchy.user_id = user_details.user_id
            INNER JOIN user_roles 
                ON user_details.role_id = user_roles.role_id
                AND user_roles.role_name IN ('Appointment Setter', 'Finance Admin', 'Sale Representative');

    -- Sales Rep, Finance Admin, and Appointment Setter check
    ELSIF v_user_role IN ('Sale Representative', 'Finance Admin', 'Appointment Setter') THEN
        RETURN QUERY
            SELECT user_details.user_id, user_details.name, user_roles.role_name 
            FROM user_details
            INNER JOIN user_roles 
                ON user_details.role_id = user_roles.role_id
                AND user_roles.role_name IN ('Appointment Setter', 'Finance Admin', 'Sale Representative')
            WHERE user_details.user_id = v_user_id;
    END IF;
END;
$$ LANGUAGE plpgsql;

