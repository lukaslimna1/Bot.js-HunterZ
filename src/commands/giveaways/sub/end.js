/**
 * @param {import('discord.js').GuildMember} member
 * @param {string} messageId
 */
module.exports = async (member, messageId) => {
  if (!messageId) return "Você deve fornecer um ID de mensagem válido.";

  // Permissions
  if (!member.permissions.has("ManageMessages")) {
    return "Você precisa ter permissões de gerenciamento de mensagens para iniciar sorteio.";
  }

  // Search with messageId
  const giveaway = member.client.giveawaysManager.giveaways.find(
    (g) => g.messageId === messageId && g.guildId === member.guild.id
  );

  // If no giveaway was found
  if (!giveaway) return `Não foi possível encontrar uma oferta para messageId: ${messageId}`;

  // Check if the giveaway is ended
  if (giveaway.ended) return "O sorteio já terminou.";

  try {
    await giveaway.end();
    return "Sucesso! O sorteio terminou!";
  } catch (error) {
    member.client.logger.error("Giveaway End", error);
    return `Ocorreu um erro ao encerrar o sorteio: ${error.message}`;
  }
};
