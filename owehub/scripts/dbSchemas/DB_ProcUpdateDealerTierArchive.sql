CREATE OR REPLACE FUNCTION update_dealer_tier_archive(
    p_ids BIGINT[],
    p_is_archived BOOLEAN,
    OUT v_dealer_tier_id INT
)
AS $$
DECLARE
    dealer_tier_id BIGINT;
BEGIN
    FOR dealer_tier_id IN SELECT unnest(p_ids)
    LOOP
        UPDATE dealer_tier dt
        SET
            is_archived = p_is_archived,
            updated_at = CURRENT_TIMESTAMP
        WHERE dt.id = dealer_tier_id;

        IF NOT FOUND THEN
            RAISE EXCEPTION 'Record with ID % not found in dealer_tier_rates table', dealer_tier_id;
        END IF;

        v_dealer_tier_id := dealer_tier_id;
    END LOOP;
END;
$$ LANGUAGE plpgsql;
