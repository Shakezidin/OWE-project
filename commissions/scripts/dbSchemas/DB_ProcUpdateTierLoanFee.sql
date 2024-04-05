CREATE OR REPLACE FUNCTION update_tier_loan_fee(
    p_record_id INT,
    p_dealer_tier_name VARCHAR,
    p_installer_name VARCHAR,
    p_state_name VARCHAR,
    p_finance_type_name VARCHAR,
    p_owe_cost VARCHAR,
    p_dlr_mu VARCHAR,
    p_dlr_cost VARCHAR,
    p_start_date VARCHAR,
    p_end_date VARCHAR,
    OUT v_type_id INT
)
RETURNS INT 
AS $$
BEGIN
    DECLARE
        v_dealer_tier_id INT;
        v_installer_id INT;
        v_state_id INT;
        v_finance_type_id INT;
    BEGIN
        -- Get IDs for foreign keys from their respective tables
        SELECT id INTO v_dealer_tier_id FROM tier WHERE tier_name = p_dealer_tier_name;
        SELECT partner_id INTO v_installer_id FROM partners WHERE partner_name = p_installer_name;
        SELECT state_id INTO v_state_id FROM states WHERE name = p_state_name;
        SELECT id INTO v_finance_type_id FROM loan_type WHERE product_code = p_finance_type_name;
        
        -- Update the tier_loan_fee table
        UPDATE tier_loan_fee
        SET 
            dealer_tier = v_dealer_tier_id,
            installer_id = v_installer_id,
            state_id = v_state_id,
            finance_type = v_finance_type_id,
            owe_cost = p_owe_cost,
            dlr_mu = p_dlr_mu,
            dlr_cost = p_dlr_cost,
            start_date = p_start_date,
            end_date = p_end_date,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = p_record_id
        RETURNING id INTO v_type_id;
        
        IF NOT FOUND THEN
            RAISE EXCEPTION 'Record with ID % not found in tier_loan_fee table', p_record_id;
        END IF;
    END;
EXCEPTION
    WHEN OTHERS THEN
        -- Handle the exception, you can log or re-raise as needed
        RAISE EXCEPTION 'Error updating record in tier_loan_fee: %', SQLERRM;
END;
$$ LANGUAGE plpgsql;
