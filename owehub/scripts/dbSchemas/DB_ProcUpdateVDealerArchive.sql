CREATE OR REPLACE FUNCTION update_v_dealer_archive(
    p_ids BIGINT[],
    p_is_active BOOLEAN,
    OUT v_dealer_id BIGINT
)
AS $$
DECLARE
    v_dealers_id BIGINT;
BEGIN
    FOR v_dealers_id IN SELECT unnest(p_ids)
    LOOP
        UPDATE v_dealer vd
        SET
            is_active = p_is_active,
            updated_at = CURRENT_TIMESTAMP
        WHERE vd.id = v_dealers_id;

        IF NOT FOUND THEN
            RAISE EXCEPTION 'Record with ID % not found in v_dealer table', v_dealers_id;
        END IF;

        -- Assign the last processed dealer ID to the OUT parameter
        v_dealer_id := v_dealers_id;
    END LOOP;
END;
$$ LANGUAGE plpgsql;
