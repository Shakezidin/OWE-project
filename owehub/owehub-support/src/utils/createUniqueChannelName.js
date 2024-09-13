const crypto = require("crypto");

function createUniqueChannelName(name, email) {
  // Remove special characters and spaces from the name and email
  const sanitizedName = name.replace(/[^a-zA-Z0-9]/g, "").toLowerCase(); // Remove special characters and convert to lowercase
  const sanitizedEmail = email.replace(/[^a-zA-Z0-9]/g, ""); // Remove special characters

  // Generate a hash from the sanitized email
  const hash = crypto
    .createHash("md5")
    .update(sanitizedEmail)
    .digest("hex")
    .substring(0, 8); // Hash and shorten

  // Combine sanitized name and hash
  const channelName = `${sanitizedName}-${hash}`;

  // Return the channel name, ensuring it is 21 characters or less
  return channelName.substring(0, 21); // Slack channel names must be 21 characters or less
}

module.exports = createUniqueChannelName;
