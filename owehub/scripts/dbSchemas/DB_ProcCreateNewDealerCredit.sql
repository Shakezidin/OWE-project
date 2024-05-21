CREATE OR REPLACE FUNCTION create_new_dealer_credit(
    p_unique_id character varying,
    p_date date,
    p_exact_amount double precision,
    p_per_kw_amount  double precision,
    p_approved_by text,
    p_notes text,
    p_total_amount double precision,
    p_sys_size double precision,
    OUT v_dealer_credit_id INT
)
RETURNS INT
AS $$
DECLARE
v_dealer_id INT;
BEGIN

    INSERT INTO dealer_credit (
        unique_id,
        date,
        exact_amount,
        per_kw_amount,
        approved_by,
        notes,
        total_amount,
        sys_size
    )
    VALUES (
        p_unique_id,
        p_date,
        p_exact_amount,
        p_per_kw_amount,
        p_approved_by,
        p_notes,
        p_total_amount,
        p_sys_size
    )
    RETURNING id INTO v_dealer_credit_id;
END;
$$ LANGUAGE plpgsql;
