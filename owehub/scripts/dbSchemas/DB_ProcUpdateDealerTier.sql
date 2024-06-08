CREATE OR REPLACE FUNCTION update_dealer_tier(
    p_record_id INT,
    p_dealer_name VARCHAR,
    p_tier_name VARCHAR,
    p_start_date date,
    p_end_date date,
    OUT v_type_id INT
)
RETURNS INT 
AS $$
BEGIN
    DECLARE
        v_dealer_id INT;
        v_tier_id INT;
    BEGIN
        -- Get IDs for foreign keys from their respective tables
        SELECT id INTO v_dealer_id FROM v_dealer WHERE LOWER(dealer_name) = LOWER(p_dealer_name);
        SELECT id INTO v_tier_id FROM tier WHERE LOWER(tier_name) = LOWER(p_tier_name);
        
        -- Update the dealer_tier table
        UPDATE dealer_tier
        SET 
            dealer_id = v_dealer_id,
            tier_id = v_tier_id,
            start_date = p_start_date,
            end_date = p_end_date,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = p_record_id
        RETURNING id INTO v_type_id;
        
        IF NOT FOUND THEN
            RAISE EXCEPTION 'Record with ID % not found in dealer_tier table', p_record_id;
        END IF;
    END;
EXCEPTION
    WHEN OTHERS THEN
        -- Handle the exception, you can log or re-raise as needed
        RAISE EXCEPTION 'Error updating record in dealer_tier: %', SQLERRM;
END;
$$ LANGUAGE plpgsql;
