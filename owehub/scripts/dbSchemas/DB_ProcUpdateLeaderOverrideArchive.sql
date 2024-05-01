CREATE OR REPLACE FUNCTION update_leader_override_archive (
    p_ids BIGINT[],
    p_is_archived BOOLEAN,
    OUT v_leader_override_id INT
)
AS $$
DECLARE
    leader_override_id BIGINT;
BEGIN
    FOR leader_override_id IN SELECT unnest(p_ids)
    LOOP
      UPDATE leader_override
        SET
            is_archived = p_is_archived,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = leader_override_id;

        IF NOT FOUND THEN
                RAISE EXCEPTION 'Record with ID % not found', leader_override_id;
        END IF;
        v_leader_override_id = leader_override_id;
    END LOOP;
END
$$ LANGUAGE plpgsql;