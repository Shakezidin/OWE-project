CREATE OR REPLACE FUNCTION create_new_auto_adder(
    p_unique_id               character varying,
	p_date                    date,
	p_type                    character varying,
	p_gc                      character varying,
	p_exact_amount            DOUBLE PRECISION,
	p_per_kw_amount           DOUBLE PRECISION,
	p_rep_percentage          DOUBLE PRECISION,
	p_description_repvisible  character varying,
	p_notes_no_repvisible     character varying,
    p_adder_type              character varying,
    OUT v_auto_adder_id INT
)
RETURNS INT
AS $$
BEGIN
    -- Insert a new auto_adder into auto_adder table
    INSERT INTO auto_adder (
    unique_id,
	date,
	type,
	gc,
	exact_amount,
	per_kw_amount,
	rep_percentage,
	description_repvisible,
	notes_no_repvisible,
    adder_type,
    is_archived
    )
    VALUES (
    p_unique_id,
	p_date,
	p_type,
	p_gc,
	p_exact_amount,
	p_per_kw_amount,
	p_rep_percentage,
	p_description_repvisible,
	p_notes_no_repvisible,
    p_adder_type,
    FALSE
    )
    RETURNING id INTO v_auto_adder_id;

END;
$$ LANGUAGE plpgsql;
