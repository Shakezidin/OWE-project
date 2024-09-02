CREATE OR REPLACE FUNCTION check_scheduling_projects_email_exists(p_email VARCHAR)
RETURNS BOOLEAN AS $$
DECLARE
    email_exists BOOLEAN;
BEGIN
    SELECT EXISTS(SELECT 1 FROM scheduling_projects WHERE email = p_email) INTO email_exists;
    RETURN email_exists;
END;
$$ LANGUAGE plpgsql;
