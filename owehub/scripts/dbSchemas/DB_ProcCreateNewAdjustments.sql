CREATE OR REPLACE FUNCTION create_new_adjustments(
    p_unique_id          character varying,
    p_customer           character varying,
    p_partner_name       character varying,
    p_installer_name     character varying,
    p_state_name     character varying,
    p_sys_size           DOUBLE PRECISION,
    p_bl                 character varying,
    p_epc                DOUBLE PRECISION,
    p_date               DATE,
    p_notes              character varying,
    p_amount             DOUBLE PRECISION,
    p_start_date         character varying,
    p_end_date           character varying,
    OUT v_adjustments_id INT
)
RETURNS INT
AS $$
DECLARE
v_partner_id   INT;
    v_installer_id INT;
    v_state_id INT;
BEGIN
    -- Get partner_id based on provided p_partner_name
SELECT partner_id INTO v_partner_id
FROM partners
WHERE partner_name = p_partner_name;

IF v_partner_id IS NULL THEN
        RAISE EXCEPTION 'Partner % not found', p_partner_name;
END IF;

    -- Get installer_id based on provided p_installer_name
SELECT partner_id INTO v_installer_id
FROM partners
WHERE partner_name = p_installer_name;

-- Check if the installer exists
IF v_installer_id IS NULL THEN
        RAISE EXCEPTION 'Installer % not found', p_installer_name;
END IF;

    -- Get sale_type_id based on provided p_sale_type_name
SELECT state_id INTO v_state_id
    FROM states
    WHERE name = p_state_name;

    -- Check if the state exists
    IF v_state_id IS NULL THEN
        RAISE EXCEPTION 'State % not found', p_state_name;
    END IF;

    -- Insert a new record into rebate_data table
INSERT INTO adjustments (
    unique_id,
    customer,
    partner,
    installer,
    state,
    sys_size,
    bl,
    epc,
    date,
    amount,
    notes,
    start_date,
    end_date
) VALUES (
             p_unique_id,
             p_customer,
             v_partner_id,
             v_installer_id,
             v_state_id,
             p_sys_size,
             p_bl,
             p_epc,
             p_date,
             p_amount,
             p_notes,
             p_start_date,
             p_end_date
         ) RETURNING id INTO v_adjustments_id;
END;
$$ LANGUAGE plpgsql;
