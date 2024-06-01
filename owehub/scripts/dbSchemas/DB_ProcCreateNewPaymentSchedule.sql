CREATE OR REPLACE FUNCTION create_new_payment_schedule(
    p_dealer VARCHAR,
    p_partner_name VARCHAR,
    p_installer_name VARCHAR,
    p_sale_type_name VARCHAR,
    p_state_name VARCHAR,
    p_rl DOUBLE PRECISION,
    p_draw DOUBLE PRECISION,
    p_draw_max DOUBLE PRECISION,
    p_rep_draw DOUBLE PRECISION,
    p_rep_draw_max DOUBLE PRECISION,
    p_rep_pay VARCHAR,
    p_start_date VARCHAR,
    p_end_date VARCHAR,
    OUT v_schedule_id INT
)
RETURNS INT
AS $$
DECLARE
    v_partner_id INT;
    v_installer_id INT;
    v_sale_type_id INT;
    v_state_id INT;
    v_dealer_id INT;
BEGIN
    -- Get the partner_id based on the provided partner_name
    SELECT partner_id INTO v_partner_id
    FROM partners
    WHERE partner_name = p_partner_name;

    -- Check if the partner exists
    IF v_partner_id IS NULL THEN
        RAISE EXCEPTION 'Partner % not found', p_partner_name;
    END IF;

    -- Get the installer_id based on the provided installer_name
    SELECT partner_id INTO v_installer_id
    FROM partners
    WHERE partner_name = p_installer_name;

    -- Check if the installer exists
    IF v_installer_id IS NULL THEN
        RAISE EXCEPTION 'Installer % not found', p_installer_name;
    END IF;

    -- Get the sale_type_id based on the provided sale_type_name
    SELECT id INTO v_sale_type_id
    FROM sale_type
    WHERE type_name = p_sale_type_name;

    -- Check if the sale type exists
    IF v_sale_type_id IS NULL THEN
        RAISE EXCEPTION 'Sale type % not found', p_sale_type_name;
    END IF;

    -- Get the state_id based on the provided state_name
    SELECT state_id INTO v_state_id
    FROM states
    WHERE name = p_state_name;

    -- Check if the state exists
    IF v_state_id IS NULL THEN
        RAISE EXCEPTION 'State % not found', p_state_name;
    END IF;

    -- Get the rep_id based on the provided partner_name (assuming it's rep_id)
    SELECT id INTO v_dealer_id
    FROM v_dealer
    WHERE dealer_name = p_dealer;

    -- Check if the rep exists
    IF v_dealer_id IS NULL THEN
        RAISE EXCEPTION 'Rep % not found', p_dealer;
    END IF;

    -- Insert new record into payment_schedule table
    INSERT INTO payment_schedule (
        dealer_id,
        partner_id,
        installer_id,
        sale_type_id,
        state_id,
        rl,
        draw,
        draw_max,
        rep_draw,
        rep_draw_max,
        rep_pay,
        start_date,
        end_date,
        is_archived
    )
    VALUES (
        v_dealer_id,
        v_partner_id,
        v_installer_id,
        v_sale_type_id,
        v_state_id,
        p_rl,
        p_draw,
        p_draw_max,
        p_rep_draw,
        p_rep_draw_max,
        p_rep_pay,
        p_start_date,
        p_end_date,
        FALSE
    )
    RETURNING id INTO v_schedule_id;

END;
$$ LANGUAGE plpgsql;
