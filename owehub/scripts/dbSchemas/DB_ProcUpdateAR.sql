CREATE OR REPLACE FUNCTION update_ar(
    p_id INT,
    p_unique_id VARCHAR,
    -- p_customer text,
    p_date DATE,
    p_amount DOUBLE PRECISION,
    p_payment_type VARCHAR,
    p_bank VARCHAR,
    p_ced DATE,
    -- p_total_paid DOUBLE PRECISION,
    -- p_state character varying,
    -- p_partner character varying,
    OUT v_ar_id INT
)
RETURNS INT 
AS $$
DECLARE
   v_partner_id INT;
    v_state_id INT;
    v_state_name TEXT;
    v_customer_name TEXT;
    v_partner_name TEXT;
    v_total_paid DOUBLE PRECISION := 0.0; -
BEGIN
    SELECT home_owner, partner INTO v_customer_name, v_partner_name
    FROM sales_ar_calc
    WHERE sales_ar_calc.unique_id = p_unique_id;
 
    IF p_date >= CURRENT_DATE - INTERVAL '30 days' THEN
        SELECT total_paid, st INTO v_total_paid, v_state_name
        FROM sales_ar_calc
        WHERE sales_ar_calc.unique_id = p_unique_id;
 
        SELECT partner_id INTO v_partner_id
        FROM partners
        WHERE partner_name = v_partner_name;

        -- Check if partner_id is null and handle accordingly
        -- IF v_partner_id IS NULL THEN
        --     RAISE EXCEPTION 'Partner % not found', v_partner_name;
        -- END IF;

        SELECT state_id INTO v_state_id
        FROM states
        WHERE name = v_state_name;

        -- Check if state_id is null and handle accordingly
        -- IF v_state_id IS NULL THEN
        --     RAISE EXCEPTION 'State % not found', v_state_name;
        -- END IF;

    END IF;

    UPDATE ar
    SET 
        unique_id = p_unique_id,
        customer  = v_customer_name,
        date = p_date,
        amount = p_amount,
        payment_type = p_payment_type,
        bank = p_bank,
        ced = p_ced,
        total_paid = v_total_paid,
        state = v_state_id,
        partner = v_partner_id,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = p_id
    RETURNING id INTO v_ar_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Record with ID % not found in ar table', p_id;
    END IF;

EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error updating record in ar: %', SQLERRM;
END;
$$ LANGUAGE plpgsql;
