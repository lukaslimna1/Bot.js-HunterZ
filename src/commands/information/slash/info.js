const user = require("../shared/user");
const channelInfo = require("../shared/channel");
const guildInfo = require("../shared/guild");
const avatar = require("../shared/avatar");
const emojiInfo = require("../shared/emoji");
const botInfo = require("../shared/botstats");
const { ApplicationCommandOptionType } = require("discord.js");

/**
 * @type {import("@structures/Command")}
 */
module.exports = {
  name: "info",
  description: "mostrar diversas informações",
  category: "INFORMATION",
  botPermissions: ["EmbedLinks"],
  command: {
    enabled: true,
  },
  slashCommand: {
    enabled: true,
    options: [
      {
        name: "user",
        description: "obter informações do usuário",
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: "name",
            description: "nome do usuário",
            type: ApplicationCommandOptionType.User,
            required: false,
          },
        ],
      },
      {
        name: "channel",
        description: "obter informações do canal",
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: "name",
            description: "nome do canal",
            type: ApplicationCommandOptionType.Channel,
            required: false,
          },
        ],
      },
      {
        name: "guild",
        description: "obter informações da guilda",
        type: ApplicationCommandOptionType.Subcommand,
      },
      {
        name: "bot",
        description: "obter informações do bot",
        type: ApplicationCommandOptionType.Subcommand,
      },
      {
        name: "avatar",
        description: "exibe informações do avatar",
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: "name",
            description: "nome do usuário",
            type: ApplicationCommandOptionType.User,
            required: false,
          },
        ],
      },
      {
        name: "emoji",
        description: "exibe informações de emoji",
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: "name",
            description: "nome do emoji",
            type: ApplicationCommandOptionType.String,
            required: true,
          },
        ],
      },
    ],
  },

  async interactionRun(interaction) {
    const sub = interaction.options.getSubcommand();
    if (!sub) return interaction.followUp("Não é um subcomando válido");
    let response;

    // user
    if (sub === "user") {
      let targetUser = interaction.options.getUser("name") || interaction.user;
      let target = await interaction.guild.members.fetch(targetUser);
      response = user(target);
    }

    // channel
    else if (sub === "channel") {
      let targetChannel = interaction.options.getChannel("name") || interaction.channel;
      response = channelInfo(targetChannel);
    }

    // guild
    else if (sub === "guild") {
      response = await guildInfo(interaction.guild);
    }

    // bot
    else if (sub === "bot") {
      response = botInfo(interaction.client);
    }

    // avatar
    else if (sub === "avatar") {
      let target = interaction.options.getUser("name") || interaction.user;
      response = avatar(target);
    }

    // emoji
    else if (sub === "emoji") {
      let emoji = interaction.options.getString("name");
      response = emojiInfo(emoji);
    }

    // return
    else {
      response = "Subcomando incorreto";
    }

    await interaction.followUp(response);
  },
};
