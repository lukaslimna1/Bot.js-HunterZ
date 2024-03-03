const { getEffectiveInvites, checkInviteRewards } = require("@handlers/invite");
const { EMBED_COLORS } = require("@root/config.js");
const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");
const { getMember } = require("@schemas/Member");

/**
 * @type {import("@structures/Command")}
 */
module.exports = {
  name: "addinvites",
  description: "adicionar convites a um membro",
  category: "INVITE",
  userPermissions: ["ManageGuild"],
  botPermissions: ["EmbedLinks"],
  command: {
    enabled: true,
    usage: "<@member|id> <invites>",
    minArgsCount: 2,
  },
  slashCommand: {
    enabled: true,
    options: [
      {
        name: "user",
        description: "o usuário para dar convites para",
        type: ApplicationCommandOptionType.User,
        required: true,
      },
      {
        name: "invites",
        description: "o número de convites para dar",
        type: ApplicationCommandOptionType.Integer,
        required: true,
      },
    ],
  },

  async messageRun(message, args) {
    const target = await message.guild.resolveMember(args[0], true);
    const amount = parseInt(args[1]);

    if (!target) return message.safeReply("Sintaxe incorreta. Você deve mencionar um alvo");
    if (isNaN(amount)) return message.safeReply("O valor do convite precisa ser um número");

    const response = await addInvites(message, target.user, parseInt(amount));
    await message.safeReply(response);
  },

  async interactionRun(interaction) {
    const user = interaction.options.getUser("user");
    const amount = interaction.options.getInteger("invites");
    const response = await addInvites(interaction, user, amount);
    await interaction.followUp(response);
  },
};

async function addInvites({ guild }, user, amount) {
  if (user.bot) return "Ops! Você não pode adicionar convites a bots";

  const memberDb = await getMember(guild.id, user.id);
  memberDb.invite_data.added += amount;
  await memberDb.save();

  const embed = new EmbedBuilder()
    .setAuthor({ name: `Adicionados convites para ${user.username}` })
    .setThumbnail(user.displayAvatarURL())
    .setColor(EMBED_COLORS.BOT_EMBED)
    .setDescription(`${user.username} agora tem ${getEffectiveInvites(memberDb.invite_data)} convites`);

  checkInviteRewards(guild, memberDb, true);
  return { embeds: [embed] };
}
