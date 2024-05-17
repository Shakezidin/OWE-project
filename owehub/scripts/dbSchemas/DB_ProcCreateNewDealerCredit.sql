CREATE OR REPLACE FUNCTION create_new_dealer_credit(
    p_unique_id character varying,
    p_customer  text,
    p_dealer_name character varying,
    p_dealer_dba  text,
    p_exact_amount  text,
    p_per_kw_amount  float,
    p_approved_by text,
    p_notes text,
    p_total_amount float,
    p_sys_size float,
    p_start_date character varying,
    p_end_date character varying,
    OUT v_dealer_credit_id INT
)
RETURNS INT
AS $$
DECLARE
v_dealer_id INT;
BEGIN
    -- Retrieve the user_id for the given dealer_id
SELECT id INTO v_dealer_id
FROM v_dealer
WHERE dealer_name = p_dealer_name;

-- Check if the dealer_id exists
IF v_dealer_id IS NULL THEN
        RAISE EXCEPTION 'Dealer with ID % not found', p_dealer_name;
END IF;

    -- Insert data into dealer_credit table
INSERT INTO dealer_credit (
    unique_id,
    customer,
    dealer_id,
    dealer_dba,
    exact_amount,
    per_kw_amount,
    approved_by,
    notes,
    total_amount,
    sys_size,
    start_date,
    end_date
)
VALUES (
   p_unique_id,
   p_customer,
   v_dealer_id,
   p_dealer_dba,
   p_exact_amount,
   p_per_kw_amount,
   p_approved_by,
   p_notes,
   p_total_amount,
   p_sys_size,
   p_start_date,
   p_end_date
)
    RETURNING id INTO v_dealer_credit_id;
END;
$$ LANGUAGE plpgsql;
