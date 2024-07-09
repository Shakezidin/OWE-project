CREATE OR REPLACE FUNCTION create_new_partner(
    p_partner_name VARCHAR,
    p_description VARCHAR,
    OUT v_partner_id INT
)
RETURNS INT
AS $$
BEGIN

    INSERT INTO partners (
        partner_name,
        description
    )
    VALUES (
        p_partner_name,
        p_description
    )
    RETURNING partner_id INTO v_partner_id;

END;
$$ LANGUAGE plpgsql;
