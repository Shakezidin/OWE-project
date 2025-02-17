-- Create superset_reports table

CREATE TABLE IF NOT EXISTS superset_reports (
    id SERIAL PRIMARY KEY,
    category VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    subtitle VARCHAR(255) NOT NULL,
    dashboard_id VARCHAR(255) NOT NULL,
    is_archived BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    created_by INT NOT NULL,
    FOREIGN KEY (created_by) REFERENCES user_details(user_id)
);


CREATE OR REPLACE FUNCTION create_superset_report(
    p_category VARCHAR,
    p_title VARCHAR,
    p_subtitle VARCHAR,
    p_dashboard_id VARCHAR,
    p_creator_email_id VARCHAR
) RETURNS INT AS $$
DECLARE
    v_superset_report_id INT;
    v_creator_user_id INT;
BEGIN
    -- Get the creator user_id via email_id
    SELECT user_id INTO v_creator_user_id
    FROM user_details
    WHERE email_id = p_creator_email_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'User with email_id % not found', p_creator_email_id;
    END IF;

    -- Insert into superset_reports table
    INSERT INTO superset_reports (
        category,
        title,
        subtitle,
        dashboard_id,
        created_by
    ) VALUES (
        p_category,
        p_title,
        p_subtitle,
        p_dashboard_id,
        v_creator_user_id
    ) RETURNING id INTO v_superset_report_id;

    -- Return the inserted superset_report's ID
    RETURN v_superset_report_id;
END;
$$ LANGUAGE plpgsql;