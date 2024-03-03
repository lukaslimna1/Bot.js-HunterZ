const { timeformat } = require("@helpers/Utils");

/**
 * @type {import("@structures/Command")}
 */
module.exports = {
  name: "uptime",
  description: "oferece tempo de atividade do bot",
  category: "INFORMATION",
  botPermissions: ["EmbedLinks"],
  command: {
    enabled: true,
  },

  async messageRun(message, args) {
    await message.safeReply(`My Uptime: \`${timeformat(process.uptime())}\``);
  },
};
