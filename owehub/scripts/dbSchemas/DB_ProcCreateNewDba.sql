CREATE OR REPLACE FUNCTION create_dba(
    p_name      CHARACTER VARYING,
    p_dba         CHARACTER VARYING,
    OUT v_dba_id INT
)
RETURNS INT
AS $$
BEGIN
  INSERT INTO dba (
      preferred_name,
      dba
  )
  VALUES (
      p_name,
      p_dba
  )
RETURNING id INTO v_dba_id;
END;
$$ LANGUAGE plpgsql;