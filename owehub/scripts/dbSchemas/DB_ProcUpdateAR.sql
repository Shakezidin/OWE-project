CREATE OR REPLACE FUNCTION update_ar(
    p_unique_id character varying,
    p_customer text,
    p_date date,
    p_amount DOUBLE PRECISION,
    p_payment_type text,
    p_bank text,
    p_ced text,
    p_total_paid DOUBLE PRECISION,
    p_state character varying,
    p_partner character varying,
    OUT v_ar_id INT
)
RETURNS INT 
AS $$
BEGIN
    UPDATE ar
    SET 
        unique_id = p_unique_id,
        customer  = p_customer,
        date = p_date,
        amount = p_amount,
        payment_type = p_payment_type,
        bank = p_bank,
        ced = p_ced,
        total_paid = p_total_paid,
        partner = (SELECT partner_id FROM partners WHERE LOWER(partner_name) = LOWER(p_partner) LIMIT 1),
        state = (SELECT state_id FROM states WHERE LOWER(name) = LOWER(p_state) LIMIT 1),
        updated_at = CURRENT_TIMESTAMP
    WHERE unique_id = p_unique_id
    RETURNING id INTO v_ar_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Record with unique_id % not found in ar table', p_unique_id;
    END IF;

EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error updating record in ar: %', SQLERRM;
END;
$$ LANGUAGE plpgsql;
