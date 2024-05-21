CREATE OR REPLACE FUNCTION update_aprep_archive(
    p_ids BIGINT[],
    p_is_archived BOOLEAN,
    OUT v_aprep_id INT
)
AS $$
DECLARE
    aprep_id BIGINT;
BEGIN
    FOR aprep_id IN SELECT unnest(p_ids)
    LOOP
        UPDATE ap_rep 
        SET
            is_archived = p_is_archived,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = aprep_id;

        IF NOT FOUND THEN
            RAISE EXCEPTION 'Record with ID % not found in ap_rep table', aprep_id;
        END IF;

        v_aprep_id := aprep_id;
    END LOOP;
END;
$$ LANGUAGE plpgsql;
