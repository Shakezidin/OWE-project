CREATE TABLE IF NOT EXISTS production_targets (
    month INTEGER NOT NULL,
    year INTEGER NOT NULL,
    projects_sold INTEGER NOT NULL,
    mw_sold DOUBLE PRECISION NOT NULL,
    install_ct INTEGER NOT NULL,
    mw_installed DOUBLE PRECISION NOT NULL,
    batteries_ct INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (month, year)
);