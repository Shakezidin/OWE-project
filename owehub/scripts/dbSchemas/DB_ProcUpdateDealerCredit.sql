CREATE OR REPLACE FUNCTION update_dealer_credit(
        p_id               INT,
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
    BEGIN
        UPDATE dealer_credit
        SET
            unique_id = p_unique_id,
            date = p_date,
            exact_amount = p_exact_amount,
            per_kw_amount = p_per_kw_amount,
            approved_by = p_approved_by,
            notes = p_notes,
            total_amount = p_total_amount,
            sys_size = p_sys_size
        WHERE
            id = p_id
        RETURNING id INTO v_dealer_credit_id;

        IF NOT FOUND THEN
            RAISE EXCEPTION 'Record with ID % not found in dealer_credit table', p_record_id;
        END IF;

    EXCEPTION
        WHEN OTHERS THEN
            RAISE EXCEPTION 'Error updating record in dealer_credit: %', SQLERRM;
    END;
    $$ LANGUAGE plpgsql;
