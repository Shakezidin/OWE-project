CREATE OR REPLACE FUNCTION create_new_reconcile(
    p_unique_id               character varying,
    p_customer                character varying,
    p_partner_name character varying,
    p_state_name character varying,
    p_sys_size double precision,
    p_status character varying,
    p_date date,
    p_amount double precision,
    p_notes character varying,
    OUT v_reconcile_data_id INT
)
RETURNS INT
AS $$
DECLARE
    v_partner_id INT;
    v_state_id INT;
BEGIN
    -- Get the user_id based on the provided p_rep_1_name
    SELECT partner_id INTO v_partner_id
    FROM partners
    WHERE partner_name = p_partner_name;

    -- Check if the partner exists
    IF v_partner_id IS NULL THEN
        RAISE EXCEPTION 'Partner % not found', p_partner_name;
    END IF;

    -- Get the state_id based on the provided state_name
    SELECT state_id INTO v_state_id
    FROM states
    WHERE name = p_state_name;

    -- Check if the state exists
    IF v_state_id IS NULL THEN
        RAISE EXCEPTION 'State % not found', p_state_name;
    END IF;

    -- Insert a new reconcile_data into reconcile data table
    INSERT INTO reconcile (
        unique_id,
        customer,
        partner_id,
        state_id,
        sys_size,
        status,
        date,
        amount,
        notes
    )
    VALUES (
      p_unique_id,
      p_customer,
      v_partner_id,
      v_state_id,
      p_sys_size,
      p_status,
      p_date,
      p_amount,
      p_notes
    )
    RETURNING id INTO v_reconcile_data_id;

END;
$$ LANGUAGE plpgsql;
