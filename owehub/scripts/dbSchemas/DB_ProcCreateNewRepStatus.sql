CREATE OR REPLACE FUNCTION create_rep_status(
    p_name      CHARACTER VARYING,
    p_status         CHARACTER VARYING,
    OUT v_rep_status_id INT
)
RETURNS INT
AS $$
BEGIN
  INSERT INTO rep_status (
      name,
      status
  )
  VALUES (
      p_name,
      p_status
  )
RETURNING id INTO v_rep_status_id;
END;
$$ LANGUAGE plpgsql;