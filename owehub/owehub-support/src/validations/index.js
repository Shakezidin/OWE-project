const { object, string, number, date, InferType } = require("yup");
const { issueTypeEnum } = require("./enums");

const configSchema = object({
  slackAppToken: string().required(),
  botToken: string().required(),
});

const startChatSchema = object({
  issueType: string().oneOf(issueTypeEnum).required(),
  email: string().email(),
  name: string().required(),
  project_id: string().required(),
});

module.exports = {
  startChatSchema,
  configSchema,
};
