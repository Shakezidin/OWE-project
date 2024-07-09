CREATE OR REPLACE FUNCTION update_rep_pay_settings_archive(
    p_ids BIGINT[],
    p_is_archived BOOLEAN,
    OUT v_rep_pay_settings_id INT
)
AS $$
DECLARE
    rep_pay_settings_id BIGINT;
BEGIN
    FOR rep_pay_settings_id IN SELECT unnest(p_ids)
        LOOP
            UPDATE rep_pay_settings rs
            SET
                is_archived = p_is_archived,
                updated_at = CURRENT_TIMESTAMP
            WHERE rs.id = rep_pay_settings_id;

            IF NOT FOUND THEN
                RAISE EXCEPTION 'Record with ID % not found in rep_pay_settings table', rep_pay_settings_id;
            END IF;

            v_rep_pay_settings_id := rep_pay_settings_id;
        END LOOP;
END;
$$ LANGUAGE plpgsql;
