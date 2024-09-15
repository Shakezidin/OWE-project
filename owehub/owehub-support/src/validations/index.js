const { object, string } = require("yup");

const configSchema = object({
  slackAppToken: string().required(),
  botToken: string().required(),
});

const startChatSchema = object({
  issueType: string().required(),
  email: string().email(),
  name: string().required(),
  project_id: string().required(),
});

module.exports = {
  startChatSchema,
  configSchema,
};
