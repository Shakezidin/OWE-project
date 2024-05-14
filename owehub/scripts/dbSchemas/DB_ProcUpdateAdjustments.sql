CREATE OR REPLACE FUNCTION update_adjustments (
    p_id INT,
    p_unique_id character varying,
    -- p_customer character varying,
    -- p_partner_name character varying,
    -- p_installer_name character varying,
    -- p_state_name character varying,
    -- p_sys_size DOUBLE PRECISION,
    -- p_bl character varying,  
    -- p_epc DOUBLE PRECISION,
    p_date date,
    p_notes character varying,
    p_amount DOUBLE PRECISION,
    OUT v_adjustments_data_id INT
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
    v_epc date;
BEGIN
  SELECT home_owner, partner, instl, st, sys_size, per_rep_sales, epc
    INTO v_customer_name, v_partner_name, v_installer_name, v_state_name, v_sys_size, v_bl, v_epc
    FROM sales_ar_calc
    WHERE sales_ar_calc.unique_id = p_unique_id;
 
    -- Get partner_id based on provided p_partner_name
    SELECT partner_id INTO v_partner_id
    FROM partners
    WHERE partner_name = v_partner_name;
 
    IF v_partner_id IS NULL THEN
        RAISE EXCEPTION 'Partner % not found', v_partner_name;
    END IF;
 
    -- Get installer_id based on provided v_installer_name
    SELECT partner_id INTO v_installer_id
    FROM partners
    WHERE partner_name = v_installer_name;
 
    -- Check if the installer exists
    IF v_installer_id IS NULL THEN
        RAISE EXCEPTION 'Installer % not found', v_installer_name;
    END IF;
 
    -- Get state_id based on provided v_state_name
    SELECT state_id INTO v_state_id
    FROM states
    WHERE name = v_state_name;
 
    -- Check if the state exists
    IF v_state_id IS NULL THEN
        RAISE EXCEPTION 'State % not found', v_state_name;
    END IF;

  UPDATE adjustments
    SET 
      unique_id = p_unique_id,
      customer = v_customer_name,
      partner = v_partner_id,
      installer = v_installer_id,
      state = v_state_id,
      sys_size = v_sys_size,
      bl = v_bl,
      epc = v_epc,
      date = p_date,
      amount = p_amount,
      notes = p_notes,
      updated_at = CURRENT_TIMESTAMP 
  WHERE id = p_id
  RETURNING id INTO v_adjustments_data_id;
IF NOT FOUND THEN
        RAISE EXCEPTION 'Record with ID % not found in adjustments_data table', p_id;
    END IF;

    -- No need for a RETURN statement when using OUT parameters
EXCEPTION
    WHEN OTHERS THEN
        -- Handle the exception, you can log or re-raise as needed
        RAISE EXCEPTION 'Error updating record in adjustments: %', SQLERRM;
END;
$$ LANGUAGE plpgsql;