const { purgeMessages } = require("@helpers/ModUtils");
const { ApplicationCommandOptionType, ChannelType } = require("discord.js");

/**
 * @type {import("@structures/Command")}
 */
module.exports = {
  name: "purge",
  description: "purge commands",
  category: "MODERATION",
  userPermissions: ["ManageMessages"],
  command: {
    enabled: true,
  },
  slashCommand: {
    enabled: true,
    ephemeral: true,
    options: [
      {
        name: "all",
        description: "limpar todas as mensagens",
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: "channel",
            description: "canal do qual as mensagens devem ser limpas",
            type: ApplicationCommandOptionType.Channel,
            channelTypes: [ChannelType.GuildText],
            required: true,
          },
          {
            name: "amount",
            description: "número de mensagens a serem excluídas (máx. 99)",
            type: ApplicationCommandOptionType.Integer,
            required: false,
          },
        ],
      },
      {
        name: "attachments",
        description: "limpar todas as mensagens com anexos",
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: "channel",
            description: "canal do qual as mensagens devem ser limpas",
            type: ApplicationCommandOptionType.Channel,
            channelTypes: [ChannelType.GuildText],
            required: true,
          },
          {
            name: "amount",
            description: "número de mensagens a serem excluídas (máx. 99)",
            type: ApplicationCommandOptionType.Integer,
            required: false,
          },
        ],
      },
      {
        name: "bots",
        description: "limpar todas as mensagens do bot",
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: "channel",
            description: "canal do qual as mensagens devem ser limpas",
            type: ApplicationCommandOptionType.Channel,
            channelTypes: [ChannelType.GuildText],
            required: true,
          },
          {
            name: "amount",
            description: "número de mensagens a serem excluídas (máx. 99)",
            type: ApplicationCommandOptionType.Integer,
            required: false,
          },
        ],
      },
      {
        name: "links",
        description: "limpar todas as mensagens com links",
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: "channel",
            description: "canal do qual as mensagens devem ser limpas",
            type: ApplicationCommandOptionType.Channel,
            channelTypes: [ChannelType.GuildText],
            required: true,
          },
          {
            name: "amount",
            description: "número de mensagens a serem excluídas (máx. 99)",
            type: ApplicationCommandOptionType.Integer,
            required: false,
          },
        ],
      },
      {
        name: "token",
        description: "limpar todas as mensagens contendo o token especificado",
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: "channel",
            description: "canal do qual as mensagens devem ser limpas",
            type: ApplicationCommandOptionType.Channel,
            channelTypes: [ChannelType.GuildText],
            required: true,
          },
          {
            name: "token",
            description: "token a ser consultado nas mensagens",
            type: ApplicationCommandOptionType.String,
            required: true,
          },
          {
            name: "amount",
            description: "número de mensagens a serem excluídas (máx. 99)",
            type: ApplicationCommandOptionType.Integer,
            required: false,
          },
        ],
      },
      {
        name: "user",
        description: "limpar todas as mensagens do usuário especificado",
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: "channel",
            description: "canal do qual as mensagens devem ser limpas",
            type: ApplicationCommandOptionType.Channel,
            channelTypes: [ChannelType.GuildText],
            required: true,
          },
          {
            name: "user",
            description: "usuário cujas mensagens precisam ser limpas",
            type: ApplicationCommandOptionType.User,
            required: true,
          },
          {
            name: "amount",
            description: "número de mensagens a serem excluídas (máx. 99)",
            type: ApplicationCommandOptionType.Integer,
            required: false,
          },
        ],
      },
    ],
  },

  async interactionRun(interaction) {
    const { options, member } = interaction;

    const sub = options.getSubcommand();
    const channel = options.getChannel("channel");
    const amount = options.getInteger("amount") || 99;

    if (amount > 100) return interaction.followUp("A quantidade máxima de mensagens que posso excluir é 99");

    let response;
    switch (sub) {
      case "all":
        response = await purgeMessages(member, channel, "ALL", amount);
        break;

      case "attachments":
        response = await purgeMessages(member, channel, "ATTACHMENT", amount);
        break;

      case "bots":
        response = await purgeMessages(member, channel, "BOT", amount);
        break;

      case "links":
        response = await purgeMessages(member, channel, "LINK", amount);
        break;

      case "token": {
        const token = interaction.options.getString("token");
        response = await purgeMessages(member, channel, "TOKEN", amount, token);
        break;
      }

      case "user": {
        const user = interaction.options.getUser("user");
        response = await purgeMessages(member, channel, "USER", amount, user);
        break;
      }

      default:
        return interaction.followUp("Ops! Não é uma seleção de comando válida");
    }

    // Success
    if (typeof response === "number") {
      return interaction.followUp(`Limpo com sucesso ${response} mensagens em ${channel}`);
    }

    // Member missing permissions
    else if (response === "MEMBER_PERM") {
      return interaction.followUp(
        `Você não tem permissão para ler o histórico de mensagens e gerenciar mensagens em ${channel}`
      );
    }

    // Bot missing permissions
    else if (response === "BOT_PERM") {
      return interaction.followUp(`Não tenho permissão para ler o histórico de mensagens e gerenciar mensagens em ${channel}`);
    }

    // No messages
    else if (response === "NO_MESSAGES") {
      return interaction.followUp("Não foram encontradas mensagens que possam ser limpas");
    }

    // Remaining
    else {
      return interaction.followUp("Falha ao limpar mensagens");
    }
  },
};
