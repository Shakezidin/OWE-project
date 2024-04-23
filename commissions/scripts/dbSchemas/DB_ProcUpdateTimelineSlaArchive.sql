CREATE OR REPLACE FUNCTION update_timeline_sla_archive(
    p_ids BIGINT[],
    p_is_archived BOOLEAN,
    OUT v_timeline_sla_id INT
)
AS $$
DECLARE
    timeline_sla_id BIGINT;
BEGIN
    FOR timeline_sla_id IN SELECT unnest(p_ids)
    LOOP
        UPDATE timeline_sla tsr
        SET
            is_archived = p_is_archived,
            updated_at = CURRENT_TIMESTAMP
        WHERE tsr.id = timeline_sla_id;

        IF NOT FOUND THEN
            RAISE EXCEPTION 'Record with ID % not found in timeline_sla_rates table', timeline_sla_id;
        END IF;

        v_timeline_sla_id := timeline_sla_id;
    END LOOP;
END;
$$ LANGUAGE plpgsql;
