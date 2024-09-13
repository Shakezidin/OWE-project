CREATE TABLE IF NOT EXISTS slackconfig (
    id serial NOT NULL,
    issue_type varchar,
    channel_name varchar,
    bot_token varchar,    
    is_archived boolean,
    slack_app_token varchar,
    created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone
);

CREATE OR REPLACE FUNCTION create_slack_config(
    p_issue_type      CHARACTER VARYING,
    p_channel_name    CHARACTER VARYING,
    p_bot_token       CHARACTER VARYING,
    p_slack_app_token CHARACTER VARYING,
    OUT v_slackconfig_id INT
)
RETURNS INT
AS $$
BEGIN
  INSERT INTO slackconfig (
      issue_type,
      channel_name,
      bot_token,
      slack_app_token
  )
  VALUES (
      p_issue_type,
      p_channel_name,
      p_bot_token,
      p_slack_app_token
  )
  RETURNING id INTO v_slackconfig_id;
END;
$$ LANGUAGE plpgsql;
