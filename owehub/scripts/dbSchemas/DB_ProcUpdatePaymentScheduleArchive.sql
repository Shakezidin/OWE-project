CREATE OR REPLACE FUNCTION update_payment_schedule_archive(
    p_ids BIGINT[],
    p_is_archived BOOLEAN,
    OUT v_payment_schedule_id INT
)
AS $$
DECLARE
    payment_schedule_id BIGINT;
BEGIN
    FOR payment_schedule_id IN SELECT unnest(p_ids)
    LOOP
        UPDATE payment_schedule psr
        SET
            is_archived = p_is_archived,
            updated_at = CURRENT_TIMESTAMP
        WHERE psr.id = payment_schedule_id;

        IF NOT FOUND THEN
            RAISE EXCEPTION 'Record with ID % not found in payment_schedule_rates table', payment_schedule_id;
        END IF;

        v_payment_schedule_id := payment_schedule_id;
    END LOOP;
END;
$$ LANGUAGE plpgsql;
