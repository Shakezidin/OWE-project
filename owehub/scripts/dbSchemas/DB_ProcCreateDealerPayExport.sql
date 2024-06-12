CREATE OR REPLACE FUNCTION create_dealer_pay_export(
    p_sys_size DOUBLE PRECISION,
    p_state_name character varying,
    p_dealer_name character varying,
    p_unique_id character varying,
    p_contract_date character varying,
    OUT v_dealer_pay_exp_id INT
)
RETURNS INT
AS $$
DECLARE
    v_small_system_size VARCHAR(20);
    v_commision_type VARCHAR(20);
BEGIN

    -- Calculate the small_system_size here --
    v_small_system_size = calc_small_sys_size(p_sys_size, p_state_name);

    -- Calculate the commition_type here --
    v_commision_type = calc_commision_type(p_dealer_name, p_unique_id, p_contract_date);

    BEGIN
        -- Insert new entry in dealer pay export table --
        INSERT INTO dealer_pay_export (
            small_system_size
        )
        VALUES (
            v_small_system_size
        )
        RETURNING id INTO v_dealer_pay_exp_id;
    EXCEPTION
        WHEN others THEN
            RAISE NOTICE 'Error: %', SQLERRM;
    END;
END;
$$ LANGUAGE plpgsql;