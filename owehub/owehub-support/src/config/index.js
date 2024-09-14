const { configSchema } = require("../validations");

require("dotenv").config();

const config = {
  oweDealerSupportChannelId: process.env.OWE_DEALER_SUPPORT_CHANNEL_ID,
  oweSalesSupportChannelId: process.env.OWE_DEALER_SUPPORT_CHANNEL_ID,
  botToken: process.env.BOT_TOKEN,
  slackAppToken: process.env.SLACK_APP_TOKEN,
  noReplyRespondTime: process.env.NO_REPLY_RESPOND_TIME,
};

configSchema.validateSync(config);

module.exports = config;
