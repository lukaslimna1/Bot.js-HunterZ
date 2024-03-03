const { EMBED_COLORS } = require("@root/config");

/**
 * @param {import('discord.js').GuildMember} member
 */
module.exports = async (member) => {
  // Permissions
  if (!member.permissions.has("ManageMessages")) {
    return "Você precisa ter permissões de gerenciamento de mensagens para gerenciar sorteios.";
  }

  // Search with all giveaways
  const giveaways = member.client.giveawaysManager.giveaways.filter(
    (g) => g.guildId === member.guild.id && g.ended === false
  );

  // No giveaways
  if (giveaways.length === 0) {
    return "Não há sorteios em execução neste servidor.";
  }

  const description = giveaways.map((g, i) => `${i + 1}. ${g.prize} in <#${g.channelId}>`).join("\n");

  try {
    return { embeds: [{ description, color: EMBED_COLORS.GIVEAWAYS }] };
  } catch (error) {
    member.client.logger.error("Giveaway List", error);
    return `Ocorreu um erro ao listar os sorteios: ${error.message}`;
  }
};
