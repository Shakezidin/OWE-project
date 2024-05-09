CREATE OR REPLACE FUNCTION update_ar_schedule(
    p_id INT,
    p_partner_name VARCHAR,
    p_installer_name VARCHAR,
    p_sale_type_name VARCHAR,
    p_state_name VARCHAR,
    p_red_line VARCHAR,
    p_calc_date VARCHAR,
    p_permit_pay VARCHAR,
    p_permit_max VARCHAR,
    p_install_pay VARCHAR,
    p_pto_pay VARCHAR,
    p_start_date date,
    p_end_date date,
    OUT v_ar_schedule_id INT
)
RETURNS INT 
AS $$
BEGIN
    UPDATE ar_schedule
    SET 
        partner = (SELECT partner_id FROM partners WHERE LOWER(partner_name) = LOWER(p_partner_name) LIMIT 1),
        installer = (SELECT partner_id FROM partners WHERE LOWER(partner_name) = LOWER(p_installer_name) LIMIT 1),
        sale_type_id = (SELECT id FROM sale_type WHERE LOWER(type_name) = LOWER(p_sale_type_name) LIMIT 1),
        state_id = (SELECT state_id FROM states WHERE LOWER(name) = LOWER(p_state_name) LIMIT 1),
        red_line = p_red_line,
        calc_date = p_calc_date,
        permit_pay = p_permit_pay,
        permit_max = p_permit_max,
        install_pay = p_install_pay,
        pto_pay = p_pto_pay,
        start_date = p_start_date,
        end_date = p_end_date
    WHERE id = p_id
        RETURNING id INTO v_ar_schedule_id;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Record with ID % not found in ar_schedule table', p_id;
    END IF;

EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error updating record in ar_schedule: %', SQLERRM;
END;
$$ LANGUAGE plpgsql;
