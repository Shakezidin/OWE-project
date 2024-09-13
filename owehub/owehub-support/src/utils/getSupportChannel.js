const config = require("../config");

const supportChannels = {
  DEALER: config.oweDealerSupportChannelId,
  SALES: config.oweSalesSupportChannelId,
};

function getSupportChannel(issueType) {
  return supportChannels[issueType];
}

module.exports = getSupportChannel;
