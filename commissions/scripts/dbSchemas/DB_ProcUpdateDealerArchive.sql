CREATE OR REPLACE FUNCTION update_dealer_override_archive(
    p_ids BIGINT[],
    p_is_archived BOOLEAN,
    OUT v_dealer_id INT
)
AS $$
DECLARE
    dealer_id BIGINT;
BEGIN
    FOR dealer_id IN SELECT unnest(p_ids)
    LOOP
        UPDATE dealer_override
        SET
            is_archived = p_is_archived,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = dealer_id;

        IF NOT FOUND THEN
            RAISE EXCEPTION 'Record with ID % not found in dealer_override table', dealer_id;
        END IF;

        v_dealer_id := dealer_id;
    END LOOP;
END;
$$ LANGUAGE plpgsql;


