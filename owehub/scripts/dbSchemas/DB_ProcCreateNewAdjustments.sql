CREATE OR REPLACE FUNCTION create_new_adjustments(
    p_unique_id character varying,
    -- p_customer character varying,
    -- p_partner_name character varying,
    -- p_installer_name character varying,
    -- p_state_name character varying,
    -- p_sys_size DOUBLE PRECISION,
    -- p_bl character varying,  
    -- p_epc DOUBLE PRECISION,
    p_date date,
    p_amount DOUBLE PRECISION,
    p_notes character varying,
    OUT v_adjustments_id INT
)
RETURNS INT
AS $$
DECLARE
    v_partner_id INT;
    v_partner_name character varying;
    v_installer_id INT;
    v_installer_name character varying;
    v_state_id INT;
    v_state_name character varying;
    v_customer_name character varying;
    v_sys_size DOUBLE PRECISION;
    v_bl DOUBLE PRECISION;
    v_epc DOUBLE PRECISION;
    v_rep_1 character varying;
    v_rep_2 character varying;
BEGIN
    SELECT home_owner, partner, instl, st, sys_size, epc, rep_1, rep_2
    INTO v_customer_name, v_partner_name, v_installer_name, v_state_name, v_sys_size, v_epc, v_rep_1, v_rep_2
    FROM sales_ar_calc
    WHERE sales_ar_calc.unique_id = p_unique_id;
 
    -- Get partner_id based on provided p_partner_name
    SELECT partner_id INTO v_partner_id
    FROM partners
    WHERE partner_name = v_partner_name;
 
    -- IF v_partner_id IS NULL THEN
    --     RAISE EXCEPTION 'Partner % not found', v_partner_name;
    -- END IF;
 
    -- Get installer_id based on provided v_installer_name
    SELECT partner_id INTO v_installer_id
    FROM partners
    WHERE partner_name = v_installer_name;
 
    -- Check if the installer exists
    -- IF v_installer_id IS NULL THEN
    --     RAISE EXCEPTION 'Installer % not found', v_installer_name;
    -- END IF;
 
    -- Get state_id based on provided v_state_name
    SELECT state_id INTO v_state_id
    FROM states
    WHERE name = v_state_name;
 
    -- Check if the state exists
    -- IF v_state_id IS NULL THEN
    --     RAISE EXCEPTION 'State % not found', v_state_name;
    -- END IF;

   SELECT
    CASE
        WHEN LENGTH(v_rep_1) > 0 AND LENGTH(v_rep_2) > 0 THEN 2
        WHEN LENGTH(v_rep_1) > 0 THEN 1
        ELSE 0
    END INTO v_bl;

 
    -- Insert a new record into adjustments table
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
        notes
    ) VALUES (
        p_unique_id,
        v_customer_name,
        v_partner_id,
        v_installer_id,
        v_state_id,
        v_sys_size,
        v_bl,
        v_epc,
        p_date,
        p_amount,
        p_notes
    ) RETURNING id INTO v_adjustments_id;
END;
$$ LANGUAGE plpgsql;