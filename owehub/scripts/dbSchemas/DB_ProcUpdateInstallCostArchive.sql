CREATE OR REPLACE FUNCTION update_install_cost_archive(
    p_ids BIGINT[],
    p_is_archived BOOLEAN,
    OUT v_install_cost_id INT
)
AS $$
DECLARE
install_cost_id BIGINT;
BEGIN
FOR install_cost_id IN SELECT unnest(p_ids)
                                  LOOP
UPDATE install_cost
SET
    is_archived = p_is_archived,
    updated_at = CURRENT_TIMESTAMP
WHERE id = install_cost_id;

IF NOT FOUND THEN
            RAISE EXCEPTION 'Record with ID % not found in install_cost table', install_cost_id;
END IF;

        v_install_cost_id := install_cost_id;
END LOOP;
END;
$$ LANGUAGE plpgsql;
