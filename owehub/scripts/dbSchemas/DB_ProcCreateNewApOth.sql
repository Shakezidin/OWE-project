CREATE OR REPLACE FUNCTION create_ap_oth(
    p_unique_id      CHARACTER VARYING,
    p_payee          CHARACTER VARYING,
    p_amount         DOUBLE PRECISION,
    p_date           DATE,
    p_short_code     CHARACTER VARYING,
    p_description    CHARACTER VARYING,
    p_notes          CHARACTER VARYING,
    OUT v_ap_oth_id INT
)
RETURNS INT
AS $$
BEGIN
  INSERT INTO ap_oth (
      unique_id,
      payee,
      amount,
      date,
      short_code,
      description,
      notes
  )
  VALUES (
      p_unique_id,
      p_payee,
      p_amount,
      p_date,
      p_short_code,
      p_description,
      p_notes
  )
RETURNING id INTO v_ap_oth_id;
END;
$$ LANGUAGE plpgsql;