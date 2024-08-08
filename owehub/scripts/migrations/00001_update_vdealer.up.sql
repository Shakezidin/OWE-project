-- Rename the column `is_active` to `is_deleted`
ALTER TABLE v_dealer
    RENAME COLUMN is_active TO is_deleted;

-- Add unique constraints to `dealer_code` and `dealer_name`
ALTER TABLE v_dealer
    ADD CONSTRAINT unique_dealer_code UNIQUE (dealer_code),
    ADD CONSTRAINT unique_dealer_name UNIQUE (dealer_name);

-- Update the existing function `update_profile_function` to include the new `dealer_code` parameter
CREATE OR REPLACE FUNCTION update_profile_function(
    p_street_address VARCHAR(255),
    p_state VARCHAR(255),
    p_city VARCHAR(255),
    p_zipcode VARCHAR(255),
    p_country VARCHAR(255),
    p_email_id VARCHAR(255),
    p_preferred_name VARCHAR(255),
    p_dealer_code VARCHAR(255), -- New parameter
    OUT v_user_id INT
)
AS $$
DECLARE
    v_dealer_id INT;
    v_role_name VARCHAR(255);
BEGIN
    -- Retrieve dealer_id and role_name
    SELECT ud.dealer_id, ur.role_name INTO v_dealer_id, v_role_name
    FROM user_details ud 
    LEFT JOIN user_roles ur ON ud.role_id = ur.role_id
    WHERE ud.email_id = p_email_id;
    
    -- Update user details
    UPDATE user_details
    SET 
        street_address = COALESCE(NULLIF(p_street_address, ''), NULL),
        state = CASE WHEN p_state IS NOT NULL AND p_state != '' THEN (SELECT state_id FROM states WHERE LOWER(name) = LOWER(p_state) LIMIT 1) ELSE NULL END,
        city = COALESCE(NULLIF(p_city, ''), NULL),
        zipcode = CASE WHEN p_zipcode IS NOT NULL AND p_zipcode != '' THEN (SELECT id FROM zipcodes WHERE LOWER(zipcode) = LOWER(p_zipcode) LIMIT 1) ELSE NULL END,
        country = COALESCE(NULLIF(p_country, ''), NULL),
        updated_at = CURRENT_TIMESTAMP
    WHERE email_id = p_email_id
    RETURNING user_id INTO v_user_id;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Record with email % not found in user_details table', p_email_id;
    END IF;

    -- Update preferred_name and dealer_code in v_dealer if role is 'Dealer Owner'
    IF v_role_name = 'Dealer Owner' AND p_preferred_name IS NOT NULL AND p_preferred_name != '' THEN
        UPDATE v_dealer
        SET 
            preferred_name = p_preferred_name,
            dealer_code = COALESCE(NULLIF(p_dealer_code, ''), dealer_code) -- Update dealer_code if provided
        WHERE id = v_dealer_id;
    END IF;

    RETURN;
EXCEPTION
    WHEN OTHERS THEN
        RAISE EXCEPTION 'Error updating record in user_details: %', SQLERRM;
END;
$$ LANGUAGE plpgsql;

-- Create or replace function `create_v_dealer`
CREATE OR REPLACE FUNCTION create_v_dealer(
    p_dealer_code VARCHAR,
    p_dealer_name VARCHAR,
    p_description VARCHAR,
    p_dealer_logo VARCHAR,
    p_bg_colour VARCHAR,
    p_preferred_name VARCHAR,
    OUT v_dealer_id INT
)
RETURNS INT
AS $$
BEGIN
    -- Insert a new v_dealer into v_dealer table
    INSERT INTO v_dealer (
        dealer_code,
        dealer_name,
        description,
        dealer_logo,
        bg_colour,
        preferred_name,
        is_deleted
    )
    VALUES (
        p_dealer_code,
        p_dealer_name,
        p_description,
        p_dealer_logo,
        p_bg_colour,
        p_preferred_name,
        FALSE
    )
    RETURNING id INTO v_dealer_id;

END;
$$ LANGUAGE plpgsql;

-- Create or replace function `update_v_dealer_archive`
CREATE OR REPLACE FUNCTION update_v_dealer_archive(
    p_ids BIGINT[],
    p_is_active BOOLEAN,
    OUT v_dealer_id BIGINT
)
AS $$
DECLARE
    v_dealers_id BIGINT;
BEGIN
    FOR v_dealers_id IN SELECT unnest(p_ids)
    LOOP
        UPDATE v_dealer vd
        SET
            is_deleted = p_is_active,
            updated_at = CURRENT_TIMESTAMP
        WHERE vd.id = v_dealers_id;

        IF NOT FOUND THEN
            RAISE EXCEPTION 'Record with ID % not found in v_dealer table', v_dealers_id;
        END IF;

        -- Assign the last processed dealer ID to the OUT parameter
        v_dealer_id := v_dealers_id;
    END LOOP;
END;
$$ LANGUAGE plpgsql;
