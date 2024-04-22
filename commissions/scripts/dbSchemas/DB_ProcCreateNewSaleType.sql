CREATE OR REPLACE FUNCTION create_new_sale_type(
    p_type_name VARCHAR,
    p_description VARCHAR,
    OUT sale_type_id INT
)
RETURNS INT
AS $$
BEGIN
    -- Insert a new v_adder into sale_type table
    INSERT INTO sale_type (
        type_name,
        description,
        is_archived
    )
    VALUES (
        p_type_name,
        p_description,
        FALSE
    )
    RETURNING id INTO sale_type_id;

END;
$$ LANGUAGE plpgsql;
