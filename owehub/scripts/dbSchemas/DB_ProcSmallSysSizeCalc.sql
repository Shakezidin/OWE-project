CREATE OR REPLACE FUNCTION calc_small_sys_size(
    sys_size DOUBLE PRECISION,
    state_name character varying
    )
RETURNS character varying
AS $$
DECLARE
    v_small_system_size character varying;
BEGIN
    IF sys_size > 0 THEN
        IF sys_size < 3 THEN
            IF state_name = 'CA' THEN
                v_small_system_size := 'SM-CA2';
            ELSE
                v_small_system_size := 'SM-UNI2';
            END IF;
        ELSIF sys_size < 4 THEN
            IF state_name != 'CA' THEN
                v_small_system_size := 'SM-UNI3';
            ELSE
                v_small_system_size := 'N/A';
            END IF;
        ELSE
            v_small_system_size := 'N/A';
        END IF;
    ELSE
        v_small_system_size := 'N/A';
    END IF;

    RETURN v_small_system_size;
END;
$$ LANGUAGE plpgsql;