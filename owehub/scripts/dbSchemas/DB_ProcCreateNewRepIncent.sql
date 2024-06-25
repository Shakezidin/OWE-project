CREATE OR REPLACE FUNCTION create_rep_incent(
    p_name      CHARACTER VARYING,
    p_doll         DOUBLE PRECISION,
    p_month         CHARACTER VARYING,
    p_comment     CHARACTER VARYING,
    OUT v_rep_incent_id INT
)
RETURNS INT
AS $$
BEGIN
  INSERT INTO rep_incent (
      name,
      doll_div_kw,
      month,
      comment
  )
  VALUES (
      p_name,
      p_doll,
      p_month,
      p_comment
  )
RETURNING id INTO v_rep_incent_id;
END;
$$ LANGUAGE plpgsql;