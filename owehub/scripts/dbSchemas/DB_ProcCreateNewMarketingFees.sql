CREATE OR REPLACE FUNCTION create_new_marketing_fees(
    p_source character varying,
    p_dba character varying,
    p_state character varying,
    p_fee_rate character varying,
    p_chg_dlr BOOLEAN,
    p_pay_src BOOLEAN,
    p_start_date date,
    p_end_date date,
    p_description character varying,
    OUT v_marketing_fees_id INT
)
RETURNS INT
AS $$
DECLARE
    v_state_id INT;
BEGIN
    -- Check if the state exists
    SELECT state_id INTO v_state_id
    FROM states
    WHERE name = p_state;

    IF v_state_id IS NULL THEN
        RAISE EXCEPTION 'State with name % not found', p_state;
    END IF;

    -- Check if the source exists
    SELECT id INTO v_marketing_fees_id
    FROM source
    WHERE name = p_source;

    IF v_marketing_fees_id IS NULL THEN
        RAISE EXCEPTION 'Source with name % not found', p_source;
    END IF;

    -- Insert new record into marketing_fees table
    INSERT INTO marketing_fees (
        source_id,
        dba,
        state_id,
        fee_rate,
        chg_dlr,
        pay_src,
        start_date,
        end_date,
        description,
        is_archived
    )
    VALUES (
        v_marketing_fees_id,
        p_dba,
        v_state_id,
        p_fee_rate,
        p_chg_dlr,
        p_pay_src,
        p_start_date,
        p_end_date,
        p_description,
        FALSE
    )
    RETURNING id INTO v_marketing_fees_id;

END;
$$ LANGUAGE plpgsql;
