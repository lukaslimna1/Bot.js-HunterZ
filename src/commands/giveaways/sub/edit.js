/**
 * @param {import('discord.js').GuildMember} member
 * @param {string} messageId
 * @param {number} addDuration
 * @param {string} newPrize
 * @param {number} newWinnerCount
 */
module.exports = async (member, messageId, addDuration, newPrize, newWinnerCount) => {
  if (!messageId) return "Você deve fornecer um ID de mensagem válido.";

  // Permissions
  if (!member.permissions.has("ManageMessages")) {
    return "Você precisa ter permissões de gerenciamento de mensagens para iniciar sorteios.";
  }

  // Search with messageId
  const giveaway = member.client.giveawaysManager.giveaways.find(
    (g) => g.messageId === messageId && g.guildId === member.guild.id
  );

  // If no giveaway was found
  if (!giveaway) return `Não foi possível encontrar uma oferta para messageId: ${messageId}`;

  try {
    await member.client.giveawaysManager.edit(messageId, {
      addTime: addDuration || 0,
      newPrize: newPrize || giveaway.prize,
      newWinnerCount: newWinnerCount || giveaway.winnerCount,
    });

    return `Atualizado com sucesso o sorteio!`;
  } catch (error) {
    member.client.logger.error("Giveaway Edit", error);
    return `Ocorreu um erro ao atualizar o sorteio: ${error.message}`;
  }
};
