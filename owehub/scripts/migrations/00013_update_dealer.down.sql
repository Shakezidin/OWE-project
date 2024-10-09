CREATE OR REPLACE FUNCTION public.update_v_dealer(p_id integer, p_dealer_code character varying, p_dealer_name character varying, p_description character varying, p_dealer_logo character varying, p_bg_colour character varying, p_preferred_name character varying, OUT v_dealer_id integer)
 RETURNS integer
 LANGUAGE plpgsql
AS $function$
BEGIN
    UPDATE v_dealer
    SET 
	        dealer_code = p_dealer_code,
	        dealer_name = p_dealer_name,
	        description = p_description,
	        dealer_logo = p_dealer_logo,
	        bg_colour = p_bg_colour,
	        preferred_name = p_preferred_name,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = p_id
    RETURNING id INTO v_dealer_id;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Record with ID % not found in v_dealer table', p_id;
    END IF;
    -- No need for a RETURN statement when using OUT parameters
EXCEPTION
    WHEN OTHERS THEN
        -- Handle the exception, you can log or re-raise as needed
        RAISE EXCEPTION 'Error updating record in v_dealers: %', SQLERRM;
END;
$function$
;