CREATE OR REPLACE FUNCTION create_ap_adv(
    p_unique_id      CHARACTER VARYING,
    p_payee          CHARACTER VARYING,
    p_date           DATE,
    p_amount         DOUBLE PRECISION,
    p_approved          CHARACTER VARYING,
    p_notes     CHARACTER VARYING,
    OUT v_ap_adv_id INT
)
RETURNS INT
AS $$
BEGIN
  INSERT INTO ap_adv (
      unique_id,
      payee,
      amount_ovrd,
      approved_by,
      date,
      notes
  )
  VALUES (
      p_unique_id,
      p_payee,
      p_amount,
      p_approved,
      p_date,
      p_notes
  )
RETURNING id INTO v_ap_adv_id;
END;
$$ LANGUAGE plpgsql;