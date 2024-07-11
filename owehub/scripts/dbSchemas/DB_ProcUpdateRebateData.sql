CREATE OR REPLACE FUNCTION update_rebate_data(
    p_id INT,
    p_customer_verf           character varying,
    p_unique_id               character varying,
	p_date                    date,
    p_type                    character varying,
    p_item                    character varying,
    p_amount                  double precision,
    p_rep_doll_divby_per      double precision,
    p_notes                   character varying,
    OUT v_rebate_data_id INT
)
RETURNS INT 
AS $$
BEGIN
    UPDATE rebate_data
    SET 
        unique_id = p_unique_id,
        customer_verf = p_customer_verf,
        item = p_item,
        amount = p_amount,
        rep_doll_divby_per = p_rep_doll_divby_per,
        notes = p_notes,
        type = p_type,
        date = p_date
    WHERE id = p_id
    RETURNING id INTO v_rebate_data_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Record with ID % not found in rebate_data table', p_id;
    END IF;

    -- No need for a RETURN statement when using OUT parameters
EXCEPTION
    WHEN OTHERS THEN
        -- Handle the exception, you can log or re-raise as needed
        RAISE EXCEPTION 'Error updating record in rebate_data: %', SQLERRM;
END;
$$ LANGUAGE plpgsql;