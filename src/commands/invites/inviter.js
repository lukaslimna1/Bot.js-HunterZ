const { getEffectiveInvites } = require("@handlers/invite");
const { EMBED_COLORS } = require("@root/config.js");
const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");
const { stripIndent } = require("common-tags");
const { getMember } = require("@schemas/Member");

/**
 * @type {import("@structures/Command")}
 */
module.exports = {
  name: "inviter",
  description: "mostra informações do convidador",
  category: "INVITE",
  botPermissions: ["EmbedLinks"],
  command: {
    enabled: true,
    usage: "[@member|id]",
  },
  slashCommand: {
    enabled: true,
    options: [
      {
        name: "user",
        description: "o usuário para obter as informações do convidador",
        type: ApplicationCommandOptionType.User,
        required: false,
      },
    ],
  },

  async messageRun(message, args, data) {
    const target = (await message.guild.resolveMember(args[0])) || message.member;
    const response = await getInviter(message, target.user, data.settings);
    await message.safeReply(response);
  },

  async interactionRun(interaction, data) {
    const user = interaction.options.getUser("user") || interaction.user;
    const response = await getInviter(interaction, user, data.settings);
    await interaction.followUp(response);
  },
};

async function getInviter({ guild }, user, settings) {
  if (!settings.invite.tracking) return `O rastreamento de convites está desativado neste servidor`;

  const inviteData = (await getMember(guild.id, user.id)).invite_data;
  if (!inviteData || !inviteData.inviter) return `Não é possível rastrear como \`${user.username}\` ingressou`;

  const inviter = await guild.client.users.fetch(inviteData.inviter, false, true);
  const inviterData = (await getMember(guild.id, inviteData.inviter)).invite_data;

  const embed = new EmbedBuilder()
    .setColor(EMBED_COLORS.BOT_EMBED)
    .setAuthor({ name: `Convidar dados para ${user.username}` })
    .setDescription(
      stripIndent`
      Convidado por: \`${inviter?.username || "Usuário deletado"}\`
      ID de quem convidou: \`${inviteData.inviter}\`
      Código de convite: \`${inviteData.code}\`
      Convites de quem convidou: \`${getEffectiveInvites(inviterData)}\`
      `
    );

  return { embeds: [embed] };
}
