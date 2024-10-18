CREATE OR REPLACE FUNCTION public.update_v_dealer(p_id VARCHAR, p_dealer_code VARCHAR varying, p_dealer_name VARCHAR varying, p_description VARCHAR varying, p_dealer_logo VARCHAR varying, p_bg_colour VARCHAR varying, p_preferred_name VARCHAR varying, OUT v_dealer_id VARCHAR)
RETURNS VARCHAR
LANGUAGE plpgsql
AS $function$
BEGIN
    UPDATE sales_partner_dbhub_schema
    SET 
        sales_partner_name = p_dealer_name
    WHERE partner_id = p_id
    RETURNING partner_id INTO v_dealer_id;

     IF NOT FOUND THEN
        RAISE EXCEPTION 'Record with ID % not found in sales_partner_dbhub_schema table', p_id;
    END IF;

    UPDATE partner_details
    SET 
        partner_code = p_dealer_code,
        description = p_description,
        partner_logo = p_dealer_logo,
        bg_colour = p_bg_colour,
        preferred_name = p_preferred_name
    WHERE partner_id = p_id
    RETURNING partner_id INTO v_dealer_id;
    
   IF NOT FOUND THEN
        INSERT INTO partner_details (partner_id, partner_code, description, partner_logo, bg_colour, preferred_name)
        VALUES (p_id, p_dealer_code, p_description, p_dealer_logo, p_bg_colour, p_preferred_name)
        RETURNING partner_id INTO v_dealer_id;
    END IF;
    -- No need for a RETURN statement when using OUT parameters
EXCEPTION
    WHEN OTHERS THEN
        -- Handle the exception, you can log or re-raise as needed
        RAISE EXCEPTION 'Error updating record in v_dealers: %', SQLERRM;
END;
$function$
;