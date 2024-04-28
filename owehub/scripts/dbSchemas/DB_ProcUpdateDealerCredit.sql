CREATE OR REPLACE FUNCTION update_dealer_credit(
        p_id               INT,
        p_unique_id        VARCHAR,
        p_customer         VARCHAR,
        p_dealer_name      VARCHAR,
        p_dealer_dba       VARCHAR,
        p_exact_amount     VARCHAR,
        p_per_kw_amount    DOUBLE PRECISION,
        p_approved_by      VARCHAR,
        p_notes            VARCHAR,
        p_total_amount     DOUBLE PRECISION,
        p_sys_size         DOUBLE PRECISION,
        p_start_date       VARCHAR,
        p_end_date         VARCHAR,
        OUT v_dealer_credit_id INT
    )
    RETURNS INT
    AS $$
    DECLARE
        v_dealer_id INT;
    BEGIN
        -- Retrieve the user_id for the given dealer_id
        SELECT user_id INTO v_dealer_id
        FROM user_details
        WHERE name = p_dealer_name;

        -- Check if the dealer_id exists
        IF v_dealer_id IS NULL THEN
            RAISE EXCEPTION 'Dealer with name % not found', p_dealer_name;
        END IF;

        -- Update data in dealer_credit table
        UPDATE dealer_credit
        SET
            unique_id = p_unique_id,
            customer = p_customer,
            dealer_id = v_dealer_id,
            dealer_dba = p_dealer_dba,
            exact_amount = p_exact_amount,
            per_kw_amount = p_per_kw_amount,
            approved_by = p_approved_by,
            notes = p_notes,
            total_amount = p_total_amount,
            sys_size = p_sys_size,
            start_date = p_start_date,
            end_date = p_end_date
        WHERE
            id = p_id
        RETURNING id INTO v_dealer_credit_id;

        IF NOT FOUND THEN
            RAISE EXCEPTION 'Record with ID % not found in dealer_credit table', p_record_id;
        END IF;

        -- No need for a RETURN statement when using OUT parameters
    EXCEPTION
        WHEN OTHERS THEN
            -- Handle the exception, you can log or re-raise as needed
            RAISE EXCEPTION 'Error updating record in dealer_credit: %', SQLERRM;
    END;
    $$ LANGUAGE plpgsql;
