CREATE OR REPLACE FUNCTION update_auto_adder(
    p_id INT,
    p_unique_id               VARCHAR,
	p_date                    date,
	p_type                    VARCHAR,
	p_gc                      VARCHAR,
	p_exact_amount            DOUBLE PRECISION,
	p_per_kw_amount           DOUBLE PRECISION,
	p_rep_percentage          DOUBLE PRECISION,
	p_description_repvisible  VARCHAR,
	p_notes_no_repvisible     VARCHAR,
    p_adder_type              VARCHAR,
    OUT v_auto_adder_id INT
)
RETURNS INT 
AS $$
BEGIN
    UPDATE auto_adder
    SET 
        unique_id = p_unique_id,
        date = p_date,
        type = p_type,
        gc = p_gc,
        exact_amount = p_exact_amount,
        per_kw_amount = p_per_kw_amount,
        rep_percentage = p_rep_percentage,
        description_repvisible = p_description_repvisible,
        notes_no_repvisible = p_notes_no_repvisible,
        adder_type = p_adder_type,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = p_id
    RETURNING id INTO v_auto_adder_id;
IF NOT FOUND THEN
        RAISE EXCEPTION 'Record with ID % not found in auto_adder table', p_id;
    END IF;

    -- No need for a RETURN statement when using OUT parameters
EXCEPTION
    WHEN OTHERS THEN
        -- Handle the exception, you can log or re-raise as needed
        RAISE EXCEPTION 'Error updating record in auto_adder: %', SQLERRM;
END;
$$ LANGUAGE plpgsql;