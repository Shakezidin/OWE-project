CREATE OR REPLACE FUNCTION update_rebate_data_archive(
    p_ids BIGINT[],
    p_is_archived BOOLEAN,
    OUT v_rebate_data_id INT
)
AS $$
DECLARE
    rebate_data_id BIGINT;
BEGIN
    FOR rebate_data_id IN SELECT unnest(p_ids)
    LOOP
        UPDATE rebate_data rd
        SET
            is_archived = p_is_archived,
            updated_at = CURRENT_TIMESTAMP
        WHERE rd.id = rebate_data_id;

        IF NOT FOUND THEN
            RAISE EXCEPTION 'Record with ID % not found in rebate_data table', rebate_data_id;
        END IF;

        v_rebate_data_id := rebate_data_id;
    END LOOP;
END;
$$ LANGUAGE plpgsql;
