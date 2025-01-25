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
