CREATE OR REPLACE FUNCTION create_new_rebate_data(
    p_customer_verf           character varying,
    p_unique_id               character varying,
	p_date                    date,
    p_type                    character varying,
    p_item                    character varying,
    p_amount                  double precision,
    p_rep_doll_divby_per      double precision,
    p_notes                   character varying,
    OUT v_rebate_data_id INT
)
RETURNS INT
AS $$
BEGIN
    INSERT INTO rebate_data (
        customer_verf,
        unique_id,
        date,
        type,
        item,
        amount,
        rep_doll_divby_per,
        notes
    )
    VALUES (
    p_customer_verf,    
    p_unique_id,               
	p_date,                  
    p_type,                
    p_item,               
    p_amount,               
    p_rep_doll_divby_per,    
    p_notes                 
    )
    RETURNING id INTO v_rebate_data_id;

END;
$$ LANGUAGE plpgsql;
