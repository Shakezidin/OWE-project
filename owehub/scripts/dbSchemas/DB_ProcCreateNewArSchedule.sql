CREATE OR REPLACE FUNCTION create_new_ar_schedule(
    p_partner_name      CHARACTER VARYING,
    p_installer_name    CHARACTER VARYING,
    p_sale_type_name    CHARACTER VARYING,
    p_state_name        CHARACTER VARYING,
    p_red_line          DOUBLE PRECISION,
    p_calc_date         CHARACTER VARYING,
    p_permit_pay        DOUBLE PRECISION,
    p_permit_max        DOUBLE PRECISION,
    p_install_pay       DOUBLE PRECISION,
    p_pto_pay           DOUBLE PRECISION,
    p_start_date        date,
    p_end_date          date,
    OUT v_ar_schedule_id INT
)
RETURNS INT
AS $$
DECLARE
v_partner_id     INT;
    v_installer_id   INT;
    v_sale_type_id   INT;
    v_state_id       INT;
BEGIN
    -- Get the partner_id based on the provided p_partner_name
SELECT partner_id INTO v_partner_id
FROM partners
WHERE partner_name = p_partner_name;

IF v_partner_id IS NULL THEN
        RAISE EXCEPTION 'Partner % not found', p_partner_name;
END IF;

    -- Get the user_id based on the provided p_rep_2_name
SELECT partner_id INTO v_installer_id
FROM partners
WHERE partner_name = p_installer_name;

-- Check if the user exists
IF v_installer_id IS NULL THEN
        RAISE EXCEPTION 'user % not found', p_installer_name;
END IF;

    -- Get the state_id based on the provided state_name
SELECT id INTO v_sale_type_id
FROM sale_type
WHERE type_name = p_sale_type_name;

IF v_sale_type_id IS NULL THEN
        RAISE EXCEPTION 'Sale type % not found', p_sale_type_name;
END IF;

    -- Get the state_id based on the provided p_state_name
SELECT state_id INTO v_state_id
FROM states
WHERE name = p_state_name;

IF v_state_id IS NULL THEN
        RAISE EXCEPTION 'State % not found', p_state_name;
END IF;

    -- Insert a new row into the rebate_data table
INSERT INTO ar_schedule (
    partner,
    installer,
    sale_type_id,
    state_id,
    red_line,
    calc_date,
    permit_pay,
    permit_max,
    install_pay,
    pto_pay,
    start_date,
    end_date
)
VALUES (
           v_partner_id,
           v_installer_id,
           v_sale_type_id,
           v_state_id,
           p_red_line,
           p_calc_date,
           p_permit_pay,
           p_permit_max,
           p_install_pay,
           p_pto_pay,
           p_start_date,
           p_end_date
       )
    RETURNING id INTO v_ar_schedule_id;

END;
$$ LANGUAGE plpgsql;