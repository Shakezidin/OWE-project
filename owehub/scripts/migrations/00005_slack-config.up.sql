CREATE TABLE IF NOT EXISTS slackconfig (
    id serial NOT NULL,
    issue_type varchar,
    channel_id varchar,
    channel_name varchar,
    bot_token varchar,    
    slack_app_token varchar,
    is_archived boolean DEFAULT FALSE,
    created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone
);

CREATE OR REPLACE FUNCTION create_slack_config(
    p_issue_type          CHARACTER VARYING,
    p_channel_id          CHARACTER VARYING,
    p_channel_name        CHARACTER VARYING,
    p_bot_token           CHARACTER VARYING,
    p_slack_app_token     CHARACTER VARYING,
    OUT v_slackconfig_id  INT
)
RETURNS INT
AS $$
BEGIN
  INSERT INTO slackconfig (
      issue_type,
      channel_id,
      channel_name,
      bot_token,
      slack_app_token
  )
  VALUES (
      p_issue_type,
      p_channel_id,
      p_channel_name,
      p_bot_token,
      p_slack_app_token
  )
  RETURNING id INTO v_slackconfig_id;
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION update_slack_config(
    p_record_id       INT,
    p_channel_id      CHARACTER VARYING,
    p_issue_type      CHARACTER VARYING,
    p_channel_name    CHARACTER VARYING,
    p_bot_token       CHARACTER VARYING,
    p_slack_app_token CHARACTER VARYING
)
RETURNS INT
AS $$
BEGIN
  UPDATE slackconfig SET
    issue_type = p_issue_type,
    channel_name = p_channel_name,
    channel_id = p_channel_id,
    bot_token = p_bot_token,
    slack_app_token = p_slack_app_token
  WHERE id = p_record_id;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'Slack Config with record id % not found', p_record_id;
  END IF;
  RETURN 1;
END;
$$ LANGUAGE plpgsql;



CREATE OR REPLACE FUNCTION update_slack_config_archive(
    p_ids BIGINT[],
    p_is_archived BOOLEAN
)
RETURNS INT
AS $$
DECLARE
sc_id BIGINT;
  BEGIN
  FOR sc_id IN SELECT unnest(p_ids)
  LOOP
    UPDATE slackconfig SET is_archived = p_is_archived, updated_at = CURRENT_TIMESTAMP WHERE id = sc_id;

    IF NOT FOUND THEN
                RAISE EXCEPTION 'Record with ID % not found in slackconfig table', sc_id;
    END IF;
  END LOOP;
  RETURN 1;
END;
$$ LANGUAGE plpgsql;