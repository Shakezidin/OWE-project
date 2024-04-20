CREATE OR REPLACE FUNCTION update_commission_archive(
    p_ids BIGINT[],
    p_is_archived BOOLEAN,
    OUT v_commission_id INT
)
AS $$
DECLARE
    commission_id BIGINT;
BEGIN
    FOR commission_id IN SELECT unnest(p_ids)
    LOOP
        UPDATE commission_rates
        SET
            is_archived = p_is_archived,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = commission_id;

        IF NOT FOUND THEN
            RAISE EXCEPTION 'Record with ID % not found in commission_rates table', commission_id;
        END IF;

        v_commission_id := commission_id;
    END LOOP;
END;
$$ LANGUAGE plpgsql;
