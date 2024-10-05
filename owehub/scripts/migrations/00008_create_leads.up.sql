
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
    zipcode INT NOT NULL,
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
    v_dealer_id INT;
BEGIN
    SELECT 
        user_details.user_id, user_details.dealer_id, user_roles.role_name 
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

    -- leads by dealer owner: users with that dealer_id except other dealer owners
    ELSIF v_user_role = 'Dealer Owner' THEN
        RETURN QUERY
            SELECT leads_info.* FROM leads_info
            INNER JOIN user_details ON user_details.dealer_id = v_dealer_id
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
            INNER JOIN user_details ON user_details.dealer_id = v_dealer_id
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
END;
$$ LANGUAGE plpgsql;


--------------------------crete lead ()---------------------
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
    v_zipcode_id INT;
    v_creator_user_id INT;
BEGIN
    -- Get the zipcode id
    IF p_zipcode IS NOT NULL AND p_zipcode != '' THEN
        SELECT id INTO v_zipcode_id
        FROM zipcodes
        WHERE zipcode = p_zipcode;

        IF NOT FOUND THEN
            RAISE EXCEPTION 'Zipcode with zipcode % not found', p_zipcode;
        END IF;
    ELSE
        v_zipcode_id := NULL;
    END IF;

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
        v_zipcode_id, 
        p_notes
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
