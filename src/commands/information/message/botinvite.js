const botinvite = require("../shared/botinvite");

/**
 * @type {import("@structures/Command")}
 */
module.exports = {
  name: "botinvite",
  description: "dá a você um convite para bot",
  category: "INFORMATION",
  botPermissions: ["EmbedLinks"],
  command: {
    enabled: true,
  },

  async messageRun(message, args) {
    const response = botinvite(message.client);
    try {
      await message.author.send(response);
      return message.safeReply("Verifique seu DM para minhas informações! :envelope_com_arrow:");
    } catch (ex) {
      return message.safeReply("I não posso lhe enviar minhas informações! Seu DM está aberto?");
    }
  },
};
