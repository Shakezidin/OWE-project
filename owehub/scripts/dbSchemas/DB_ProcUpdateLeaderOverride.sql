CREATE OR REPLACE FUNCTION update_leader_override (
    p_id INT,
    p_team_name VARCHAR,
    p_type VARCHAR,
    p_leader_name VARCHAR,
    p_term VARCHAR,
    p_qual VARCHAR,
    p_sales_q DOUBLE PRECISION,
    p_team_kw_q DOUBLE PRECISION,
    p_pay_rate DOUBLE PRECISION,
    p_start_date              DATE,
	  p_end_date                DATE,
    OUT v_leader_override_id INT
)
RETURNS INT 
AS $$
BEGIN
  UPDATE leader_override
    SET 
        team_id = (SELECT team_id FROM teams WHERE LOWER(team_name) = LOWER(p_team_name) LIMIT 1),
        leader_name = p_leader_name,
        type = p_type,
        term = p_term,
        qual = p_qual,
        sales_q = p_sales_q,
        team_kw_q = p_team_kw_q,
        pay_rate = p_pay_rate,
        start_date = p_start_date,
        end_date = p_end_date  
    WHERE id = p_id
    RETURNING id INTO v_leader_override_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Record with ID % not found in leader_override table', p_id;
    END IF;

EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error updating record in leader_override: %', SQLERRM;
END;
$$ LANGUAGE plpgsql;