CREATE TABLE IF NOT EXISTS production_targets (
    month INTEGER NOT NULL,
    year INTEGER NOT NULL,
    state TEXT NOT NULL,
    user_id INTEGER NOT NULL,
    target_percentage SMALLINT NOT NULL DEFAULT 100,
    projects_sold DOUBLE PRECISION NOT NULL,
    mw_sold DOUBLE PRECISION NOT NULL,
    install_ct DOUBLE PRECISION NOT NULL,
    mw_installed DOUBLE PRECISION NOT NULL,
    batteries_ct DOUBLE PRECISION NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (month, year, target_percentage, state, user_id),
    FOREIGN KEY (user_id) REFERENCES user_details(user_id)
);

-------------------------get production targets hierarchy ------------------
CREATE OR REPLACE FUNCTION get_production_targets_hierarchy(p_email VARCHAR(255))
    RETURNS SETOF production_targets AS $$
DECLARE
    v_user_id INT;
    v_user_role VARCHAR;
BEGIN
    SELECT
        user_details.user_id, user_roles.role_name
        INTO v_user_id, v_user_role
    FROM user_details
    INNER JOIN user_roles ON user_details.role_id = user_roles.role_id
    WHERE email_id = p_email;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'User with email_id % not found', p_email;
    END IF;

    -- admin can see all targets
    IF v_user_role = 'Admin' THEN
        RETURN QUERY
            SELECT * FROM production_targets WHERE user_id = 1;
    -- account manager
    ELSIF v_user_role = 'Account Manager' THEN
        RETURN QUERY
            SELECT production_targets.* FROM production_targets
            WHERE
                production_targets.user_id = v_user_id ;
    END IF;
END;
$$ LANGUAGE plpgsql;
