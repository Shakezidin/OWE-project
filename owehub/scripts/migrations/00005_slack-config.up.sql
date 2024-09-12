CREATE TABLE slackconfig (
    id serial NOT NULL,
    issue_type varchar,
    channel_name varchar,
    bot_token varchar,
    slack_app_token varchar,
    created_at timestamptz DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone
);