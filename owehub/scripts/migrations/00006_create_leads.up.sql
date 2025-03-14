
/***************************** leads_status DB TABLE  ************************************************/
CREATE TABLE if NOT EXISTS leads_status (
    status_id serial PRIMARY KEY,
    status_name VARCHAR(50) NOT NULL
);


/***************************** Leads DB TABLE  ************************************************/
CREATE TABLE if NOT EXISTS leads_info (
    leads_id serial NOT NULL UNIQUE,
    first_name character varying NOT NULL,
    last_name character varying NOT NULL,
    email_id character varying NOT NULL UNIQUE,
    phone_number character varying NOT NULL UNIQUE,
    street_address character varying,
    city VARCHAR(80),
    state INT,
    zipcode INT,
    proposal_type TEXT,
    finance_type TEXT,
    finance_company TEXT,
    sale_submission_triggered BOOLEAN,
    qc_audit TEXT,
    proposal_signed TEXT,
    appointment_disposition TEXT,
    appointment_disposition_note TEXT,
    is_archived BOOLEAN DEFAULT FALSE,
    notes character varying,
    created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamptz DEFAULT CURRENT_TIMESTAMP,
    appointment_scheduled_date timestamptz,
    appointment_declined_date timestamptz,
    appointment_accepted_date timestamptz,
    appointment_date timestamptz,
    lead_won_date timestamptz,
    lead_lost_date timestamptz,
    proposal_created_date timestamptz,
    status_id INT DEFAULT 0,
    created_by INT NOT NULL,
    last_updated_by INT,
    lead_source VARCHAR(255),
    FOREIGN KEY (created_by) REFERENCES user_details(user_id),
    FOREIGN KEY (last_updated_by) REFERENCES user_details(user_id),
    FOREIGN KEY (state) REFERENCES states(state_id),
    FOREIGN KEY (zipcode) REFERENCES zipcodes(id),
    FOREIGN KEY (status_id) REFERENCES leads_status(status_id),
    PRIMARY KEY (leads_id)
);


-------------------------get leads info hierarchy ------------------
CREATE OR REPLACE FUNCTION get_leads_info_hierarchy(p_email VARCHAR(255))
    RETURNS SETOF leads_info AS $$
DECLARE
    v_user_id INT;
    v_user_role VARCHAR;
    v_dealer_id VARCHAR;
BEGIN
    SELECT
        user_details.user_id, user_details.partner_id, user_roles.role_name
        INTO v_user_id, v_dealer_id, v_user_role
    FROM user_details
    INNER JOIN user_roles ON user_details.role_id = user_roles.role_id
    WHERE email_id = p_email;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'User with email_id % not found', p_email;
    END IF;

    -- admin can see all leads
    IF v_user_role = 'Admin' THEN
        RETURN QUERY
            SELECT * FROM leads_info;

    -- leads by dealer owner: users with that partner_id except other dealer owners
    ELSIF v_user_role = 'Dealer Owner' THEN
        RETURN QUERY
            SELECT leads_info.* FROM leads_info
            INNER JOIN user_details ON user_details.partner_id = v_dealer_id
            INNER JOIN user_roles ON user_details.role_id = user_roles.role_id
            WHERE
                leads_info.created_by = user_details.user_id AND
                (
                    user_details.user_id = v_user_id OR
                    user_roles.role_name IN (
                        'SubDealer Owner',
                        'Regional Manager',
                        'Sales Manager',
                        'Sale Representative'
                ));

    -- leads by subdealer owner: same as above but excluding dealer owners
    ELSIF v_user_role = 'SubDealer Owner' THEN
        RETURN QUERY
            SELECT leads_info.* FROM leads_info
            INNER JOIN user_details ON user_details.partner_id = v_dealer_id
            INNER JOIN user_roles ON user_details.role_id = user_roles.role_id
            WHERE
                leads_info.created_by = user_details.user_id AND
                (
                    user_details.user_id = v_user_id OR
                    user_roles.role_name IN (
                        'Regional Manager',
                        'Sales Manager',
                        'Sale Representative'
                ));

    ELSIF v_user_role = 'Regional Manager' OR v_user_role = 'Sales Manager' OR v_user_role = 'Sale Representative' THEN
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
            SELECT leads_info.* FROM leads_info
            INNER JOIN hierarchy ON hierarchy.user_id = leads_info.created_by;
    END IF;

    -- manage access for appointment setter, finance admin, account executive, account manager,project manager, db user and partner
    IF v_user_role IN ('Appointment Setter', 'Finance Admin', 'Account Executive', 'Account Manager', 'Project Manager','DB User', 'Partner') THEN
        RETURN QUERY
            SELECT * FROM leads_info WHERE leads_info.created_by = v_user_id;
    END IF;
END;
$$ LANGUAGE plpgsql;


--------------------------create lead ()---------------------
CREATE OR REPLACE FUNCTION create_lead(
    p_creator_email_id VARCHAR,
    p_first_name VARCHAR,
    p_last_name VARCHAR,
    p_email_id VARCHAR,
    p_phone_number VARCHAR,
    p_street_address VARCHAR,
    --p_zipcode VARCHAR,
    p_notes VARCHAR,
    p_salerep_id INT,
    p_frontend_base_url VARCHAR,
    p_lead_source VARCHAR,
    p_setter_id INT
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
        --zipcode,
        notes,
        salerep_id,
        frontend_base_url,
        lead_source,
        setter_id
    ) VALUES (
        v_creator_user_id,
        p_first_name,
        p_last_name,
        p_email_id,
        p_phone_number,
        p_street_address,
        --p_zipcode,
        p_notes,
        p_salerep_id,
        p_frontend_base_url,
        p_lead_source,
        p_setter_id
    ) RETURNING leads_id INTO v_lead_id;

    -- Return the inserted lead's ID
    RETURN v_lead_id;

    EXCEPTION WHEN unique_violation THEN RAISE EXCEPTION 'EMAIL_OR_PHONE_NO._EXISTS';
END;
$$ LANGUAGE plpgsql;

------------------------insert into status ------------


INSERT INTO public.leads_status (status_id, status_name)
VALUES
(0, 'PENDING'),
(1, 'SENT'),
(2, 'ACCEPTED'),
(3, 'DECLINED'),
(4, 'ACTION NEEDED'),
(5, 'WON' ),
(6, 'LOST' );


------------insert into zipcode


INSERT INTO zipcodes (id, zipcode) VALUES
(1, 90210),
(2, 90211),
(3, 90212),
(5, 67609),
(6, 90001),
(7, 24800),
(8, 80014),
(9, 80301),
(10, 80202),
(11, 84101),
(12, 85001),
(13, 86001),
(14, 87001),
(15, 88001),
(16, 89001),
(17, 90005),
(18, 90007),
(20, 382629),
(19, 248001);


DELETE FROM leads_info; -- TODO: find a way to preserve data

ALTER TABLE leads_info DROP CONSTRAINT leads_info_zipcode_fkey;
ALTER TABLE leads_info ALTER COLUMN zipcode TYPE VARCHAR(20);

ALTER TABLE leads_info ALTER COLUMN qc_audit TYPE BOOLEAN USING qc_audit::BOOLEAN, ALTER COLUMN qc_audit SET DEFAULT FALSE;

ALTER TABLE leads_info ALTER COLUMN proposal_signed TYPE BOOLEAN USING proposal_signed::BOOLEAN,
ALTER COLUMN proposal_signed SET DEFAULT FALSE;

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

ALTER TABLE leads_info ADD COLUMN IF NOT EXISTS salerep_id INT;
ALTER TABLE leads_info ADD CONSTRAINT leads_info_salerep_id_fkey
    FOREIGN KEY (salerep_id)
    REFERENCES user_details(user_id) ON DELETE SET NULL;
ALTER TABLE leads_info ADD COLUMN IF NOT EXISTS frontend_base_url VARCHAR(255);

-- GET SALES REPS UNDER AUTHENTICATED USER
CREATE OR REPLACE FUNCTION get_users_under(p_email_id VARCHAR, p_roles VARCHAR[])
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
                AND user_roles.role_name = ANY (p_roles);

    -- Account Executive or Account Manager or Project Manager check
    ELSIF v_user_role IN ('Account Executive', 'Account Manager' , 'Project Manager') THEN
        RETURN QUERY
            SELECT user_details.user_id, user_details.name, user_roles.role_name
            FROM user_details
            INNER JOIN sales_partner_dbhub_schema
                ON user_details.partner_id = sales_partner_dbhub_schema.partner_id
            INNER JOIN user_roles
                ON user_details.role_id = user_roles.role_id
                AND user_roles.role_name = ANY (p_roles)
            WHERE (v_user_role = 'Account Executive' AND sales_partner_dbhub_schema.account_executive = v_user_name)
               OR (v_user_role = 'Account Manager' AND sales_partner_dbhub_schema.account_manager = v_user_name)
               OR (v_user_role = 'Project Manager' AND sales_partner_dbhub_schema.project_manager = v_user_name);

    -- Dealer Owner and Sub Dealer Owner check
    ELSIF v_user_role IN ('Dealer Owner', 'SubDealer Owner') THEN
        RETURN QUERY
            SELECT user_details.user_id, user_details.name, user_roles.role_name
            FROM user_details
            INNER JOIN user_roles
                ON user_details.role_id = user_roles.role_id
                AND user_roles.role_name = ANY (p_roles)
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
                AND user_roles.role_name = ANY (p_roles);

    -- Sales Rep, Finance Admin, and Appointment Setter check
    ELSIF v_user_role IN ('Sale Representative', 'Finance Admin', 'Appointment Setter') THEN
        RETURN QUERY
            SELECT user_details.user_id, user_details.name, user_roles.role_name
            FROM user_details
            INNER JOIN user_roles
                ON user_details.role_id = user_roles.role_id
                AND user_roles.role_name = ANY (p_roles)
            WHERE user_details.user_id = v_user_id;
    END IF;
END;
$$ LANGUAGE plpgsql;
