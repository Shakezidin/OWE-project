CREATE OR REPLACE FUNCTION update_adjustments (
    p_id INT,
    p_unique_id           VARCHAR,
    p_customer VARCHAR,
    p_partner_name VARCHAR,
    p_installer_name VARCHAR,
    p_state_name VARCHAR,
    p_sys_size DOUBLE PRECISION,
    p_bl VARCHAR,
    p_epc DOUBLE PRECISION,
    p_date DATE,
    p_notes VARCHAR,
    p_amount DOUBLE PRECISION,
    p_start_date              VARCHAR,
	  p_end_date                VARCHAR,
    OUT v_adjustments_data_id INT
)
RETURNS INT 
AS $$
BEGIN
  UPDATE adjustments
    SET 
      unique_id = p_unique_id,
      customer = p_customer,
      partner = (SELECT partner_id FROM partners WHERE LOWER(partner_name) = LOWER(p_partner_name) LIMIT 1),
      installer = (SELECT partner_id FROM partners WHERE LOWER(partner_name) = LOWER(p_installer_name) LIMIT 1),
      state = (SELECT state_id FROM states WHERE LOWER(name) = LOWER(p_state_name) LIMIT 1),
      sys_size = p_sys_size,
      bl = p_bl,
      epc = p_epc,
      date = p_date,
      notes = p_notes,
      amount = p_amount,
      start_date = p_start_date,
      end_date = p_end_date  
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