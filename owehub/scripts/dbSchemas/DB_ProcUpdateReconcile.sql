CREATE OR REPLACE FUNCTION update_reconcile(
    p_id INT,
    p_unique_id VARCHAR,
    p_customer VARCHAR,
    p_partner_name VARCHAR,
    p_state_name VARCHAR,
    p_sys_size DOUBLE PRECISION,
    p_status VARCHAR,
    p_start_date date,
    p_end_date date,
    p_amount DOUBLE PRECISION,
    p_notes VARCHAR,
    OUT v_reconcile_id INT
)

RETURNS INT 
AS $$
BEGIN
    UPDATE reconcile
    SET 
        unique_id = p_unique_id,
        customer = p_customer,
        partner_id = (SELECT partner_id FROM partners WHERE LOWER(partner_name) = LOWER(p_partner_name) LIMIT 1),
        state_id = (SELECT state_id FROM states WHERE LOWER(name) = LOWER(p_state_name) LIMIT 1),
        sys_size = p_sys_size,
        status = p_status,
        start_date = p_start_date,
        end_date = p_end_date,
        amount = p_amount,
        notes = p_notes
    WHERE id = p_id
    RETURNING id INTO v_reconcile_id;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Record with ID % not found in reconcile table', p_id;
    END IF;

EXCEPTION
    WHEN unique_violation THEN
            RAISE EXCEPTION 'Unique constraint violation: unique_id % already exists.', p_unique_id;
    WHEN others THEN
            RAISE EXCEPTION 'An error occurred: %', SQLERRM;
END;
$$ LANGUAGE plpgsql;
