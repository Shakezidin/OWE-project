CREATE OR REPLACE FUNCTION create_new_state(
    p_state_abbr VARCHAR,
    p_state_name VARCHAR,
    OUT v_state_id INT
)
RETURNS INT
AS $$
BEGIN

    INSERT INTO states (
        abbr,
        name
    )
    VALUES (
        p_state_abbr,
        p_state_name
    )
    RETURNING state_id INTO v_state_id;

END;
$$ LANGUAGE plpgsql;
