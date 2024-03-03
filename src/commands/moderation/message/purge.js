const { purgeMessages } = require("@helpers/ModUtils");

/**
 * @type {import("@structures/Command")}
 */
module.exports = {
  name: "purge",
  description: "exclui a quantidade especificada de mensagens",
  category: "MODERATION",
  userPermissions: ["ManageMessages"],
  botPermissions: ["ManageMessages", "ReadMessageHistory"],
  command: {
    enabled: true,
    usage: "<amount>",
    minArgsCount: 1,
  },

  async messageRun(message, args) {
    const amount = args[0];

    if (isNaN(amount)) return message.safeReply("Números só são permitidos");
    if (parseInt(amount) > 99) return message.safeReply("A quantidade máxima de mensagens que posso excluir é 99");

    const { channel } = message;
    const response = await purgeMessages(message.member, channel, "ALL", amount);

    if (typeof response === "number") {
      return channel.safeSend(`Excluído com sucesso ${response} mensagens`, 5);
    } else if (response === "BOT_PERM") {
      return message.safeReply("Eu não tenho `Read Message History` & `Manage Messages`para excluir mensagens", 5);
    } else if (response === "MEMBER_PERM") {
      return message.safeReply("Você não tem `Read Message History` & `Manage Messages` para excluir mensagens", 5);
    } else if (response === "NO_MESSAGES") {
      return channel.safeSend("Nenhuma mensagem encontrada que possa ser limpa", 5);
    } else {
      return message.safeReply(`Ocorreu um erro! Falha ao excluir mensagens`);
    }
  },
};
