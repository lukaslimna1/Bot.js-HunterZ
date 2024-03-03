/**
 * @param {import('discord.js').GuildMember} member
 * @param {string} messageId
 */
module.exports = async (member, messageId) => {
  if (!messageId) return "Você deve fornecer um ID de mensagem válido.";

  // Permissions
  if (!member.permissions.has("ManageMessages")) {
    return "Você precisa ter permissões de gerenciamento de mensagens para gerenciar sorteios.";
  }

  // Search with messageId
  const giveaway = member.client.giveawaysManager.giveaways.find(
    (g) => g.messageId === messageId && g.guildId === member.guild.id
  );

  // If no giveaway was found
  if (!giveaway) return `Não foi possível encontrar uma oferta para messageId: ${messageId}`;

  // Check if the giveaway is unpaused
  if (!giveaway.pauseOptions.isPaused) return "Este sorteio não está pausado.";

  try {
    await giveaway.unpause();
    return "Sucesso! Sorteio não pausado!";
  } catch (error) {
    member.client.logger.error("Giveaway Resume", error);
    return `Ocorreu um erro ao retomar o sorteio: ${error.message}`;
  }
};
