CREATE OR REPLACE FUNCTION create_ap_ded(
    p_unique_id      CHARACTER VARYING,
    p_payee          CHARACTER VARYING,
    p_amount         DOUBLE PRECISION,
    p_date           DATE,
    p_short_code     CHARACTER VARYING,
    p_description    CHARACTER VARYING,
    OUT v_ap_ded_id INT
)
RETURNS INT
AS $$
BEGIN
  INSERT INTO ap_ded (
      unique_id,
      payee,
      amount,
      date,
      short_code,
      description
  )
  VALUES (
      p_unique_id,
      p_payee,
      p_amount,
      p_date,
      p_short_code,
      p_description
  )
RETURNING id INTO v_ap_ded_id;
END;
$$ LANGUAGE plpgsql;