CREATE OR REPLACE FUNCTION update_payment_schedule(
    p_record_id INT,
    p_partner VARCHAR,
    p_partner_name VARCHAR,
    p_installer_name VARCHAR,
    p_sale_type VARCHAR,
    p_state VARCHAR,
    p_rl DOUBLE PRECISION,
    p_draw DOUBLE PRECISION,
    p_draw_max DOUBLE PRECISION,
    p_rep_draw DOUBLE PRECISION,
    p_rep_draw_max DOUBLE PRECISION,
    p_rep_pay VARCHAR,
    p_start_date VARCHAR,
    p_end_date VARCHAR,
    OUT v_payment_schedule_id INT
)
RETURNS INT 
AS $$
BEGIN
    UPDATE payment_schedule
    SET 
        partner_id = (SELECT partner_id FROM partners WHERE LOWER(partner_name) = LOWER(p_partner_name) LIMIT 1),
        installer_id = (SELECT partner_id FROM partners WHERE LOWER(partner_name) = LOWER(p_installer_name) LIMIT 1),
        sale_type_id = (SELECT id FROM sale_type WHERE LOWER(type_name) = LOWER(p_sale_type) LIMIT 1),
        state_id = (SELECT state_id FROM states WHERE LOWER(name) = LOWER(p_state) LIMIT 1),
        rl = p_rl,
        draw = p_draw,
        draw_max = p_draw_max,
        rep_draw = p_rep_draw,
        rep_draw_max = p_rep_draw_max,
        rep_pay = p_rep_pay,
        start_date = p_start_date,
        end_date = p_end_date,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = p_record_id
    RETURNING id INTO v_payment_schedule_id;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Record with ID % not found in payment_schedule table', p_record_id;
    END IF;

EXCEPTION
    WHEN OTHERS THEN
        -- Handle the exception, you can log or re-raise as needed
        RAISE EXCEPTION 'Error updating record in payment_schedule: %', SQLERRM;
END;
$$ LANGUAGE plpgsql;
