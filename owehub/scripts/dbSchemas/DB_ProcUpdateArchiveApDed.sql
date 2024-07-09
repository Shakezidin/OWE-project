CREATE OR REPLACE FUNCTION update_ap_ded_archive(
    p_ids BIGINT[],
    p_is_archived BOOLEAN,
    OUT v_ap_ded_id INT
)
AS $$
DECLARE
ap_ded_id BIGINT;
BEGIN
FOR ap_ded_id IN SELECT unnest(p_ids)
LOOP
UPDATE ap_ded ad
SET
    is_archived = p_is_archived,
    updated_at = CURRENT_TIMESTAMP
WHERE ad.id = ap_ded_id;

IF NOT FOUND THEN
            RAISE EXCEPTION 'Record with ID % not found in adder_credit table', ap_ded_id;
END IF;

        v_ap_ded_id := ap_ded_id;
END LOOP;
END;
$$ LANGUAGE plpgsql;
