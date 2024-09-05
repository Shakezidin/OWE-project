CREATE OR REPLACE FUNCTION update_scheduling_project(
    p_email VARCHAR,
    p_is_appointment_approved BOOLEAN DEFAULT FALSE,
    p_site_survey_start_dt timestamp without time zone DEFAULT NULL,
    p_site_survey_end_dt timestamp without time zone DEFAULT NULL
)
RETURNS INT
AS $$
DECLARE
    update_count INT;
BEGIN
    WITH rows AS (
        UPDATE scheduling_projects
        SET is_appointment_approved = p_is_appointment_approved,
            site_survey_start_dt = p_site_survey_start_dt,
            site_survey_end_dt = p_site_survey_end_dt
        WHERE email = p_email
        RETURNING 1
    )
    SELECT count(*) INTO update_count FROM rows;

    IF update_count = 0 THEN
        RAISE EXCEPTION 'Project with %s does not exist', p_email;
    END IF;

    RETURN 0;

    EXCEPTION
        -- Handle any other exceptions
        WHEN others THEN
            RAISE EXCEPTION 'An error occurred while updating the project: %', SQLERRM;

END;
$$ LANGUAGE plpgsql;