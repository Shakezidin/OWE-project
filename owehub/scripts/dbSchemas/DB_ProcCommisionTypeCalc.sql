CREATE OR REPLACE FUNCTION calc_commision_type(
    p_dealer_name character varying,
    p_unique_id character varying,
    p_contract_date character varying
    )
RETURNS character varying
AS $$
DECLARE
  v_commision_type character varying;
  v_contract_date timestamp;
BEGIN
  v_contract_date := TO_TIMESTAMP(p_contract_date, 'YYYY-MM-DD');

  IF p_unique_id IS NOT NULL THEN
    IF p_dealer_name = 'Onyx Solar' OR (p_dealer_name = 'P&S' AND v_contract_date > '2023-10-08'::timestamp) THEN
      v_commision_type := '80/20';
    ELSIF p_dealer_name = 'SKM Lion Mentality' AND v_contract_date > '2023-11-10'::timestamp THEN
      v_commision_type := '80/20';
    ELSE
      v_commision_type := 'Standard Comm';
    END IF;
  ELSE
    v_commision_type := '';
  END IF;

  RETURN v_commision_type;
END;
$$ LANGUAGE plpgsql;