CREATE OR REPLACE FUNCTION create_new_leader_override (
       p_team_name character varying,
       p_type character varying,
       p_leader_name character varying,
       p_term character varying,
       p_qual character varying,
       p_sales_q double precision,
       p_team_kw_q double precision,
       p_pay_rate double precision,
       p_start_date date,
       p_end_date date,
       OUT v_leader_override_id INT
)
       RETURNS INT
       AS $$
DECLARE
v_team_id INT;
BEGIN
SELECT team_id INTO v_team_id
FROM teams
WHERE team_name = p_team_name;

IF v_team_id IS NULL THEN
        RAISE EXCEPTION 'User % not found', p_team_name;
END IF;

INSERT INTO leader_override (
    team_id,
    leader_name,
    type,
    term,
    qual,
    sales_q,
    team_kw_q,
    pay_rate,
    start_date,
    end_date
)
VALUES (
           v_team_id,
           p_leader_name,
           p_type,
           p_term,
           p_qual,
           p_sales_q,
           p_team_kw_q,
           p_pay_rate,
           p_start_date,
           p_end_date
       )
    RETURNING id INTO v_leader_override_id;
END;
$$ LANGUAGE plpgsql;
