CREATE OR REPLACE FUNCTION create_new_commission(
    p_team_name character varying,
    p_installer_name character varying,
    p_state_name character varying,
    p_sale_type_name character varying,
    p_sale_price double precision,
    p_rep_type_name character varying,
    p_rl double precision,
    p_is_archived BOOLEAN,
    p_rate double precision,
    p_start_date character varying,
    p_end_date character varying,
    OUT v_setters_id INT
)
RETURNS INT
AS $$
DECLARE
    v_partner_id INT;
    v_installer_id INT;
    v_state_id INT;
    v_sale_type_id INT;
    v_rep_type_id INT;
BEGIN
    -- Get the partner_id based on the provided partner_name
    SELECT partner_id INTO v_partner_id
    FROM partners
    WHERE partner_name = p_team_name;

    -- Check if the partner exists
    IF v_partner_id IS NULL THEN
        RAISE EXCEPTION 'Partner % not found', p_team_name;
    END IF;

    -- Get the installer_id based on the provided installer_name
    SELECT partner_id INTO v_installer_id
    FROM partners
    WHERE partner_name = p_installer_name;

    -- Check if the installer exists
    IF v_installer_id IS NULL THEN
        RAISE EXCEPTION 'Installer % not found', p_installer_name;
    END IF;

    -- Get the state_id based on the provided state_name
    SELECT state_id INTO v_state_id
    FROM states
    WHERE name = p_state_name;

    -- Check if the state exists
    IF v_state_id IS NULL THEN
        RAISE EXCEPTION 'State % not found', p_state_name;
    END IF;

    -- Get the sale_type_id based on the provided sale_type_name
    SELECT id INTO v_sale_type_id
    FROM sale_type
    WHERE type_name = p_sale_type_name;

    -- Check if the sale type exists
    IF v_sale_type_id IS NULL THEN
        RAISE EXCEPTION 'Sale type % not found', p_sale_type_name;
    END IF;

    -- Get the rep_type_id based on the provided rep_type_name
    SELECT id INTO v_rep_type_id
    FROM rep_type
    WHERE rep_type = p_rep_type_name;

    -- Check if the rep type exists
    IF v_rep_type_id IS NULL THEN
        RAISE EXCEPTION 'Rep type % not found', p_rep_type_name;
    END IF;

    -- Insert a new commission into commission_rates table
    INSERT INTO commission_rates (
        partner_id,
        installer_id,
        state_id,
        sale_type_id,
        sale_price,
        rep_type,
        rl,
        is_archived,
        rate,
        start_date,
        end_date
    )
    VALUES (
        v_partner_id,
        v_installer_id,
        v_state_id,
        v_sale_type_id,
        p_sale_price,
        v_rep_type_id,
        p_rl,
        p_is_archived,
        p_rate,
        p_start_date,
        p_end_date
    )
    RETURNING id INTO v_setters_id;

END;
$$ LANGUAGE plpgsql;
