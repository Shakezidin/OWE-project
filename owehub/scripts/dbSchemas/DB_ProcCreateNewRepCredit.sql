CREATE OR REPLACE FUNCTION create_rep_credit(
    p_unique_id      CHARACTER VARYING,
    p_per_kw          DOUBLE PRECISION,
    p_amount         DOUBLE PRECISION,
    p_date           DATE,
    p_approved     CHARACTER VARYING,
    p_notes    CHARACTER VARYING,
    OUT v_rep_credit_id INT
)
RETURNS INT
AS $$
BEGIN
  INSERT INTO rep_credit (
      unique_id,
      per_kw_amt,
      exact_amt,
      date,
      approved_by,
      notes
  )
  VALUES (
      p_unique_id,
      p_per_kw,
      p_amount,
      p_date,
      p_approved,
      p_notes
  )
RETURNING id INTO v_rep_credit_id;
END;
$$ LANGUAGE plpgsql;