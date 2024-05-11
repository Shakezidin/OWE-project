CREATE OR REPLACE FUNCTION create_new_ar(
    p_unique_id CHARACTER VARYING,
    p_date DATE,
    p_amount DOUBLE PRECISION,
    p_payment_type TEXT,
    p_bank TEXT,
    p_ced DATE,
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
    v_total_paid DOUBLE PRECISION;
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

        -- IF v_partner_id IS NULL THEN
        --     RAISE EXCEPTION 'Partner % not found', v_partner_name;
        -- END IF;

        SELECT state_id INTO v_state_id
        FROM states
        WHERE name = v_state_name;

        -- IF v_state_id IS NULL THEN
        --     RAISE EXCEPTION 'State % not found', v_state_name;
        -- END IF;

        INSERT INTO ar (
            unique_id,
            customer,
            date,
            amount,
            payment_type,
            bank,
            ced,
            total_paid,
            state,
            partner,
            is_archived
        )
        VALUES (
            p_unique_id,
            v_customer_name,
            p_date,
            p_amount,
            p_payment_type,
            p_bank,
            p_ced,
            v_total_paid,
            v_state_id,
            v_partner_id,
            FALSE
        ) RETURNING id INTO v_ar_id;
    END IF;
END;
$$ LANGUAGE plpgsql;
