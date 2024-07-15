CREATE OR REPLACE FUNCTION update_commission(
    p_id INT,
    p_partner VARCHAR,
    p_installer VARCHAR,
    p_state VARCHAR,
    p_sale_type VARCHAR,
    p_sale_price DOUBLE PRECISION,
    p_rep_type VARCHAR,
    p_rl DOUBLE PRECISION,
    p_rate DOUBLE PRECISION,
    p_start_date date,
    p_end_date date,
    OUT v_commissions_id INT
)
RETURNS INT 
AS $$
BEGIN
    UPDATE commission_rates
    SET 
        partner_id = (SELECT partner_id FROM partners WHERE LOWER(partner_name) = LOWER(p_partner) LIMIT 1),
        installer_id = (SELECT partner_id FROM partners WHERE LOWER(partner_name) = LOWER(p_installer) LIMIT 1),
        state_id = (SELECT state_id FROM states WHERE LOWER(name) = LOWER(p_state) LIMIT 1),
        sale_type_id = (SELECT id FROM sale_type WHERE LOWER(type_name) = LOWER(p_sale_type) LIMIT 1),
        sale_price = p_sale_price,
        rep_type = (SELECT id FROM rep_type WHERE LOWER(rep_type) = LOWER(p_rep_type) LIMIT 1),
        rl = p_rl,
        rate = p_rate,
        start_date = p_start_date,
        end_date = p_end_date,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = p_id
    RETURNING id INTO v_commissions_id;
IF NOT FOUND THEN
        RAISE EXCEPTION 'Record with ID % not found in commission_rates table', p_id;
    END IF;

    -- No need for a RETURN statement when using OUT parameters
EXCEPTION
    WHEN OTHERS THEN
        -- Handle the exception, you can log or re-raise as needed
        RAISE EXCEPTION 'Error updating record in commission_rates: %', SQLERRM;
END;
$$ LANGUAGE plpgsql;
