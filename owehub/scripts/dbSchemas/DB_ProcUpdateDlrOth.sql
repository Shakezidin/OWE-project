CREATE OR REPLACE FUNCTION update_dlr_oth(
    p_id                      INT,
    p_unique_id               VARCHAR,
    p_payee                   VARCHAR,
    p_amount                  DOUBLE PRECISION,
    p_description             VARCHAR,
    p_balance                 DOUBLE PRECISION,
    p_paid_amount             DOUBLE PRECISION,
    p_date                    DATE,
    OUT v_dlr_oth_id INT
)
RETURNS INT
AS $$
BEGIN
    -- Update data in dlr_oth table
    UPDATE dlr_oth
    SET
        unique_id = p_unique_id,
        payee = p_payee,
        amount = p_amount,
        description = p_description,
        balance = p_balance,
        paid_amount = p_paid_amount,
        date = p_date
    WHERE
        id = p_id
    RETURNING id INTO v_dlr_oth_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Record with ID % not found in dlr_oth table', p_id;
    END IF;

EXCEPTION
    WHEN OTHERS THEN
        -- Handle the exception, you can log or re-raise as needed
        RAISE EXCEPTION 'Error updating record in dlr_oth: %', SQLERRM;
END;
$$ LANGUAGE plpgsql;
