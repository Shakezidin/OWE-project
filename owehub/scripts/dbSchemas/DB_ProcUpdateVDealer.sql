CREATE OR REPLACE FUNCTION update_v_dealer(
    p_id INT,
    p_dealer_code VARCHAR,
    p_dealer_name VARCHAR,
    p_description VARCHAR,
    p_dealer_logo VARCHAR,
    p_bg_colour VARCHAR,
    p_preferred_name VARCHAR,
    OUT v_dealer_id INT
)
RETURNS INT 
AS $$
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
$$ LANGUAGE plpgsql;
