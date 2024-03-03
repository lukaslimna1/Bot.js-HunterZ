const {
  EmbedBuilder,
  ButtonBuilder,
  ActionRowBuilder,
  ApplicationCommandOptionType,
  ButtonStyle,
} = require("discord.js");
const { timeformat } = require("@helpers/Utils");
const { EMBED_COLORS, SUPPORT_SERVER, DASHBOARD } = require("@root/config.js");
const botstats = require("../shared/botstats");

/**
 * @type {import("@structures/Command")}
 */
module.exports = {
  name: "bot",
  description: "comandos relacionados ao bot",
  category: "INFORMATION",
  botPermissions: ["EmbedLinks"],
  command: {
    enabled: true,
  },
  slashCommand: {
    enabled: true,
    options: [
      {
        name: "invite",
        description: "receba o convite do bot",
        type: ApplicationCommandOptionType.Subcommand,
      },
      {
        name: "stats",
        description: "obter estatísticas do bot",
        type: ApplicationCommandOptionType.Subcommand,
      },
      {
        name: "uptime",
        description: "obtenha o tempo de atividade do bot",
        type: ApplicationCommandOptionType.Subcommand,
      },
    ],
  },

  async interactionRun(interaction) {
    const sub = interaction.options.getSubcommand();
    if (!sub) return interaction.followUp("Não é um subcomando válido");

    // Invite
    if (sub === "invite") {
      const response = botInvite(interaction.client);
      try {
        await interaction.user.send(response);
        return interaction.followUp("Verifique seu DM para minhas informações! :envelope_com_arrow:");
      } catch (ex) {
        return interaction.followUp("Não consigo te enviar meus dados! Seu DM está aberto?");
      }
    }

    // Stats
    else if (sub === "stats") {
      const response = botstats(interaction.client);
      return interaction.followUp(response);
    }

    // Uptime
    else if (sub === "uptime") {
      await interaction.followUp(`Meu tempo de atividade: \`${timeformat(process.uptime())}\``);
    }
  },
};

function botInvite(client) {
  const embed = new EmbedBuilder()
    .setAuthor({ name: "Invite" })
    .setColor(EMBED_COLORS.BOT_EMBED)
    .setThumbnail(client.user.displayAvatarURL())
    .setDescription("Ei! Obrigado por considerar me convidar \n Use o botão abaixo para navegar para onde quiser");

  // Buttons
  let components = [];
  components.push(new ButtonBuilder().setLabel("Link de convite").setURL(client.getInvite()).setStyle(ButtonStyle.Link));

  if (SUPPORT_SERVER) {
    components.push(new ButtonBuilder().setLabel("Servidor de suporte").setURL(SUPPORT_SERVER).setStyle(ButtonStyle.Link));
  }

  if (DASHBOARD.enabled) {
    components.push(
      new ButtonBuilder().setLabel("Link do painel").setURL(DASHBOARD.baseURL).setStyle(ButtonStyle.Link)
    );
  }

  let buttonsRow = new ActionRowBuilder().addComponents(components);
  return { embeds: [embed], components: [buttonsRow] };
}
