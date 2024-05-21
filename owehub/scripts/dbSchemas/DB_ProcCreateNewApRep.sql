CREATE OR REPLACE FUNCTION create_new_ap_rep(
    p_unique_id character varying,
    p_rep character varying,
    p_dba character varying,
    p_type character varying,
    p_date date,
    p_amount double precision,
    p_method character varying,
    p_cbiz character varying,
    p_transaction character varying,
    p_notes character varying,
    OUT v_aprep_id INT
)
RETURNS INT
AS $$
BEGIN
    INSERT INTO ap_rep (
        unique_id,
        rep,
        dba,
        type,
        date,
        amount,
        method,
        cbiz,
        transaction,
        notes
    )
    VALUES (
        p_unique_id,
        p_rep,
        p_dba,
        p_type,
        p_date,
        p_amount,
        p_method,
        p_cbiz,
        p_transaction,
        p_notes
    )
    RETURNING id INTO v_aprep_id;
END;
$$ LANGUAGE plpgsql;
