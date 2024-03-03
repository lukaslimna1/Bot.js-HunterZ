/**
 * @param {import('discord.js').GuildMember} member
 * @param {string} messageId
 */
module.exports = async (member, messageId) => {
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

  // Check if the giveaway is ended
  if (!giveaway.ended) return "O sorteio ainda não terminou.";

  try {
    await giveaway.reroll();
    return "Sorteio relançado!";
  } catch (error) {
    member.client.logger.error("Giveaway Reroll", error);
    return `Ocorreu um erro ao relançar o sorteio: ${error.message}`;
  }
};
