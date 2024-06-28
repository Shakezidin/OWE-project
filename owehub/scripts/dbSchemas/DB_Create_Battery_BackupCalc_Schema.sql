CREATE TABLE breaker_info (
    breaker_id SERIAL PRIMARY KEY,
    ampere NUMERIC,
    category TEXT,
    note TEXT
);

CREATE TABLE prospects_info (
    prospect_id serial PRIMARY KEY,
    prospect_name character varying,
    sr_email_id  character varying,
    water_heater TEXT,
    cooking_appliances TEXT,
    furnace TEXT,
    clothes_dryer TEXT,
    pool_pump BOOLEAN,
    well_pump BOOLEAN,
    ev_charger BOOLEAN,
    spa BOOLEAN,
    panel_images_url TEXT[]
);

CREATE TABLE prospect_load_info (
    prospect_load_id SERIAL PRIMARY KEY,
    prospect_id INT REFERENCES prospects_info(prospect_id),
    lra NUMERIC,
    average_capacity NUMERIC,
    continous_current NUMERIC
);

CREATE TABLE prospect_load_breakers (
    prospect_load_id INT REFERENCES prospect_load_info(prospect_load_id),
    breaker_id INT REFERENCES breaker_info(breaker_id),
    PRIMARY KEY (prospect_load_id, breaker_id)
);
