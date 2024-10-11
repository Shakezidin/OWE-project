CREATE OR REPLACE FUNCTION public.update_v_dealer(p_id BIGINT, p_dealer_code character varying, p_dealer_name character varying, p_description character varying, p_dealer_logo character varying, p_bg_colour character varying, p_preferred_name character varying, OUT v_dealer_id BIGINT)
RETURNS BIGINT
LANGUAGE plpgsql
AS $function$
BEGIN
    UPDATE sales_partner_dbhub_schema
    SET 
        sales_partner_name = p_dealer_name
    WHERE item_id = p_id
    RETURNING item_id INTO v_dealer_id;

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