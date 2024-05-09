CREATE OR REPLACE FUNCTION create_new_ar(
    p_unique_id character varying,
    p_customer text,
    p_date date,
    p_amount DOUBLE PRECISION,
    p_payment_type text,
    p_bank text,
    p_ced date,
    p_total_paid DOUBLE PRECISION,
    p_state character varying,
    p_partner character varying,
    OUT v_ar_id INT
)
RETURNS INT
AS $$
DECLARE
    v_partner_id INT;
    v_state_id INT;
BEGIN
    SELECT partner_id INTO v_partner_id
    FROM partners
    WHERE partner_name = p_partner;

    IF v_partner_id IS NULL THEN
        RAISE EXCEPTION 'Partner % not found', p_partner;
    END IF;

    SELECT state_id INTO v_state_id
    FROM states
    WHERE name = p_state;

    IF v_state_id IS NULL THEN
        RAISE EXCEPTION 'State % not found', p_state;
    END IF;

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
        p_customer,
        p_date,
        p_amount,
        p_payment_type,
        p_bank,
        p_ced,
        p_total_paid,
        v_state_id,
        v_partner_id,
        FALSE
    )RETURNING id INTO v_ar_id;
END;
$$ LANGUAGE plpgsql;
