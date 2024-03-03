const { purgeMessages } = require("@helpers/ModUtils");

/**
 * @type {import("@structures/Command")}
 */
module.exports = {
  name: "purgelinks",
  description: "deletes the specified amount of messages with links",
  category: "MODERATION",
  userPermissions: ["ManageMessages"],
  botPermissions: ["ManageMessages", "ReadMessageHistory"],
  command: {
    enabled: true,
    usage: "[amount]",
    aliases: ["purgelink"],
  },

  async messageRun(message, args) {
    const amount = args[0] || 99;

    if (amount) {
      if (isNaN(amount)) return message.safeReply("Numbers are only allowed");
      if (parseInt(amount) > 99) return message.safeReply("The max amount of messages that I can delete is 99");
    }

    const { channel } = message;
    const response = await purgeMessages(message.member, message.channel, "LINK", amount);

    if (typeof response === "number") {
      return channel.safeSend(`Excluído com sucesso ${response} mensagem`, 5);
    } else if (response === "BOT_PERM") {
      return message.safeReply("Eu não tenho `Read Message History` & `Manage Messages` para excluir mensagens", 5);
    } else if (response === "MEMBER_PERM") {
      return message.safeReply("Você não tenho `Read Message History` & `Manage Messages` para excluir mensagens", 5);
    } else if (response === "NO_MESSAGES") {
      return channel.safeSend("Nenhuma mensagem encontrada que possa ser limpa", 5);
    } else {
      return message.safeReply(`Ocorreu um erro! Fracassado para excluir mensagens`);
    }
  },
};
