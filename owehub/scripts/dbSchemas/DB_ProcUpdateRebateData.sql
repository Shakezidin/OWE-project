CREATE OR REPLACE FUNCTION update_rebate_data(
    p_id INT,
    p_unique_id               VARCHAR,
    p_customer_verf           VARCHAR,
	p_type_rd_mktg            VARCHAR,
    p_item                    VARCHAR,
	p_amount                  VARCHAR,
	p_rep_doll_divby_per      DOUBLE PRECISION,
    p_notes                   VARCHAR,
    p_type                    VARCHAR,
	p_rep_1_name              VARCHAR,
	p_rep_2_name              VARCHAR,
	p_sys_size                DOUBLE PRECISION,
	p_rep_count               DOUBLE PRECISION,
	p_state_name              VARCHAR,
	p_per_rep_addr_share      DOUBLE PRECISION,
	p_per_rep_ovrd_share      DOUBLE PRECISION,
	p_r1_pay_scale            DOUBLE PRECISION,
	p_rep_1_def_resp          VARCHAR,
	p_r1_addr_resp            VARCHAR,
	p_r2_pay_scale            DOUBLE PRECISION,
	p_per_rep_def_ovrd        VARCHAR,
    p_r1_rebate_credit_$      VARCHAR,
    p_r1_rebate_credit_perc   VARCHAR,
    p_r2_rebate_credit_$      VARCHAR,
    p_r2_rebate_credit_perc   VARCHAR, 
	p_start_date              VARCHAR,
	p_end_date                VARCHAR,
    OUT v_rebate_data_id INT
)
RETURNS INT 
AS $$
BEGIN
    UPDATE rebate_data
    SET 
        unique_id = p_unique_id,
        customer_verf = p_customer_verf,
        type_rd_mktg = p_type_rd_mktg,
        item = p_item,
        amount = p_amount,
        rep_doll_divby_per = p_rep_doll_divby_per,
        notes = p_notes,
        type = p_type,
        rep_1 = (SELECT user_id FROM user_details WHERE LOWER(name) = LOWER(p_rep_1_name) LIMIT 1),
        rep_2 = (SELECT user_id FROM user_details WHERE LOWER(name) = LOWER(p_rep_2_name) LIMIT 1),
        sys_size = p_sys_size,
        rep_count = p_rep_count,
        state_id = (SELECT state_id FROM states WHERE LOWER(name) = LOWER(p_state_name) LIMIT 1),
        per_rep_addr_share = p_per_rep_addr_share,
        per_rep_ovrd_share = p_per_rep_ovrd_share,
        r1_pay_scale = p_r1_pay_scale,
        rep_1_def_resp = p_rep_1_def_resp,
        r1_addr_resp = p_r1_addr_resp,
        r2_pay_scale = p_r2_pay_scale,
        per_rep_def_ovrd = p_per_rep_def_ovrd,
        r1_rebate_credit_$ = p_r1_rebate_credit_$,
        r1_rebate_credit_perc = p_r1_rebate_credit_perc,
        r2_rebate_credit_$ = p_r2_rebate_credit_$,
        r2_rebate_credit_perc = p_r2_rebate_credit_perc,
        start_date = p_start_date,
        end_date = p_end_date  
    WHERE id = p_id
    RETURNING id INTO v_rebate_data_id;
IF NOT FOUND THEN
        RAISE EXCEPTION 'Record with ID % not found in rebate_data table', p_id;
    END IF;

    -- No need for a RETURN statement when using OUT parameters
EXCEPTION
    WHEN OTHERS THEN
        -- Handle the exception, you can log or re-raise as needed
        RAISE EXCEPTION 'Error updating record in rebate_data: %', SQLERRM;
END;
$$ LANGUAGE plpgsql;