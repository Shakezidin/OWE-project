CREATE OR REPLACE FUNCTION create_new_dlr_oth(
    p_unique_id               character varying,
    p_payee                   character varying,
    p_amount                  float,
    p_description             character varying,
    p_balance                 float,
    p_paid_amount             float,
    p_date                    character varying,
    OUT v_dlr_oth_id    INT
)
RETURNS INT
AS $$
BEGIN
    -- Insert data into dlr_oth table
    INSERT INTO dlr_oth (
        unique_id,
        payee,
        amount,
        description,
        balance,
        paid_amount,
        date
    )
    VALUES (
       p_unique_id,
       p_payee,
       p_amount,
       p_description,
       p_balance,
       p_paid_amount,
       p_date
    )
    RETURNING id INTO v_dlr_oth_id;
END;
$$ LANGUAGE plpgsql;
