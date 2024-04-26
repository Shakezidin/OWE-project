CREATE OR REPLACE FUNCTION create_new_non_comm_dlr_pay(
    unique_id varchar NOT NULL UNIQUE,
	customer   text,
    dealer_id INT,
    dealer_dba  text,
	exact_amtount  text,
    approved_by text,
    notes text,
	balance  float,
	paid_amount  float,
	dba  text,
    start_date character varying NOT NULL,
    end_date character varying,
    OUT v_non_comm_dlr_pay_id    INT
)
RETURNS INT
AS $$
DECLARE
v_dealer_id INT;
BEGIN
    -- Retrieve the user_id for the given dealer_id
SELECT user_id INTO v_dealer_id
FROM user_details
WHERE dealer_owner = dealer_id;

-- Check if the dealer_id exists
IF v_dealer_id IS NULL THEN
            RAISE EXCEPTION 'Dealer with ID % not found', dealer_id;
END IF;

INSERT INTO noncomm_dlrpay (
    unique_id,
    customer,
    dealer_id,
    dealer_dba,
    exact_amtount,
    approved_by,
    notes,
    balance,
    paid_amount,
    dba,
    start_date,
    end_date
)
VALUES (
   unique_id,
   customer,
   dealer_id,
   dealer_dba,
   exact_amtount,
   approved_by,
   notes,
   balance,
   paid_amount,
   dba,
   start_date,
   end_date
)
RETURNING id INTO v_non_comm_dlr_pay_id;
END;
$$ LANGUAGE plpgsql;
