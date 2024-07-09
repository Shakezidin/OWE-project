CREATE OR REPLACE FUNCTION update_v_adders_archive(
    p_ids BIGINT[],
    p_is_archived BOOLEAN,
    OUT v_v_adder_id INT
)
AS $$
DECLARE
    v_adder_id BIGINT;
BEGIN
    FOR v_adder_id IN SELECT unnest(p_ids)
    LOOP
        UPDATE v_adders vd
        SET
            is_archived = p_is_archived,
            updated_at = CURRENT_TIMESTAMP
        WHERE vd.id = v_adder_id;

        IF NOT FOUND THEN
            RAISE EXCEPTION 'Record with ID % not found in v_adders table', v_adder_id;
        END IF;

        v_v_adder_id := v_adder_id;
    END LOOP;
END;
$$ LANGUAGE plpgsql;
