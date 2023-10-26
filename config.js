require('dotenv').config();

module.exports = {
  token: process.env.BOT_TOKEN,
  ownerIds: JSON.parse(process.env.OWNER_IDS),
};
