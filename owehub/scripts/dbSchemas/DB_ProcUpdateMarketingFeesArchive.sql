CREATE OR REPLACE FUNCTION update_marketing_fees_archive(
    p_ids BIGINT[],
    p_is_archived BOOLEAN,
    OUT v_marketing_fees_id INT
)
AS $$
DECLARE
    marketing_fees_id BIGINT;
BEGIN
    FOR marketing_fees_id IN SELECT unnest(p_ids)
    LOOP
        UPDATE marketing_fees mf
        SET
            is_archived = p_is_archived,
            updated_at = CURRENT_TIMESTAMP
        WHERE mf.id = marketing_fees_id;

        IF NOT FOUND THEN
            RAISE EXCEPTION 'Record with ID % not found in marketing_fees table', marketing_fees_id;
        END IF;

        v_marketing_fees_id := marketing_fees_id;
    END LOOP;
END;
$$ LANGUAGE plpgsql;
