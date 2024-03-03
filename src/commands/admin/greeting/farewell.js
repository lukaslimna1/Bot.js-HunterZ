const { isHex } = require("@helpers/Utils");
const { buildGreeting } = require("@handlers/greeting");
const { ApplicationCommandOptionType, ChannelType } = require("discord.js");

/**
 * @type {import("@structures/Command")}
 */
module.exports = {
  name: "despedida",
  description: "configuração de mensagem de despedida",
  category: "ADMIN",
  userPermissions: ["ManageGuild"],
  command: {
    enabled: true,
    minArgsCount: 1,
    subcommands: [
      {
        trigger: "status <on|off>",
        description: "ativa ou desativa a mensagem de despedida",
      },
      {
        trigger: "channel <#channel>",
        description: "configuração da mensagem de despedida",
      },
      {
        trigger: "preview",
        description: "visualiza a mensagem de despedida configurada",
      },
      {
        trigger: "desc <text>",
        description: "define a descrição do embed",
      },
      {
        trigger: "thumbnail <ON|OFF>",
        description: "ativa/desativa a miniatura do embed",
      },
      {
        trigger: "color <hexcolor>",
        description: "define a cor do embed",
      },
      {
        trigger: "footer <text>",
        description: "define o conteúdo do rodapé do embed",
      },
      {
        trigger: "image <url>",
        description: "define a imagem do embed",
      },
    ],
  },
  slashCommand: {
    enabled: true,
    ephemeral: true,
    options: [
      {
        name: "status",
        description: "ativa ou desativa a mensagem de despedida",
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: "status",
            description: "ativado ou desativado",
            required: true,
            type: ApplicationCommandOptionType.String,
            choices: [
              {
                name: "ON",
                value: "ON",
              },
              {
                name: "OFF",
                value: "OFF",
              },
            ],
          },
        ],
      },
      {
        name: "preview",
        description: "visualiza a mensagem de despedida configurada",
        type: ApplicationCommandOptionType.Subcommand,
      },
      {
        name: "channel",
        description: "configura o canal de despedida",
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: "channel",
            description: "nome do canal",
            type: ApplicationCommandOptionType.Channel,
            channelTypes: [ChannelType.GuildText],
            required: true,
          },
        ],
      },
      {
        name: "desc",
        description: "define a descrição do embed",
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: "content",
            description: "conteúdo da descrição",
            type: ApplicationCommandOptionType.String,
            required: true,
          },
        ],
      },
      {
        name: "thumbnail",
        description: "configura a miniatura do embed",
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: "status",
            description: "status da miniatura",
            type: ApplicationCommandOptionType.String,
            required: true,
            choices: [
              {
                name: "ON",
                value: "ON",
              },
              {
                name: "OFF",
                value: "OFF",
              },
            ],
          },
        ],
      },
      {
        name: "color",
        description: "define a cor do embed",
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: "hex-code",
            description: "código de cor hexadecimal",
            type: ApplicationCommandOptionType.String,
            required: true,
          },
        ],
      },
      {
        name: "footer",
        description: "define o rodapé do embed",
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: "content",
            description: "conteúdo do rodapé",
            type: ApplicationCommandOptionType.String,
            required: true,
          },
        ],
      },
      {
        name: "image",
        description: "define a imagem do embed",
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: "url",
            description: "URL da imagem",
            type: ApplicationCommandOptionType.String,
            required: true,
          },
        ],
      },
    ],
  },

  async messageRun(message, args, data) {
    const type = args[0].toLowerCase();
    const settings = data.settings;
    let response;

    // visualização
    if (type === "preview") {
      response = await sendPreview(settings, message.member);
    }

    // status
    else if (type === "status") {
      const status = args[1]?.toUpperCase();
      if (!status || !["ON", "OFF"].includes(status))
        return message.safeReply("Status inválido. O valor deve ser `on/off`");
      response = await setStatus(settings, status);
    }

    // canal
    else if (type === "channel") {
      const channel = message.mentions.channels.first();
      response = await setChannel(settings, channel);
    }

    // desc
    else if (type === "desc") {
      if (args.length < 2) return message.safeReply("Argumentos insuficientes! Por favor, forneça um conteúdo válido");
      const desc = args.slice(1).join(" ");
      response = await setDescription(settings, desc);
    }

    // miniatura
    else if (type === "thumbnail") {
      const status = args[1]?.toUpperCase();
      if (!status || !["ON", "OFF"].includes(status))
        return message.safeReply("Status inválido. O valor deve ser `on/off`");
      response = await setThumbnail(settings, status);
    }

    // cor
    else if (type === "color") {
      const color = args[1];
      if (!color || !isHex(color)) return message.safeReply("Cor inválida. O valor deve ser um código de cor hexadecimal válido");
      response = await setColor(settings, color);
    }

    // rodapé
    else if (type === "footer") {
      if (args.length < 2) return message.safeReply("Argumentos insuficientes! Por favor, forneça um conteúdo válido");
      const content = args.slice(1).join(" ");
      response = await setFooter(settings, content);
    }

    // imagem
    else if (type === "image") {
      const url = args[1];
      if (!url) return message.safeReply("URL de imagem inválida. Por favor, forneça uma URL válida");
      response = await setImage(settings, url);
    }

    //
    else response = "Uso inválido do comando!";
    return message.safeReply(response);
  },

  async interactionRun(interaction, data) {
    const sub = interaction.options.getSubcommand();
    const settings = data.settings;

    let response;
    switch (sub) {
      case "preview":
        response = await sendPreview(settings, interaction.member);
        break;

      case "status":
        response = await setStatus(settings, interaction.options.getString("status"));
        break;

      case "channel":
        response = await setChannel(settings, interaction.options.getChannel("channel"));
        break;

      case "desc":
        response = await setDescription(settings, interaction.options.getString("content"));
        break;

      case "thumbnail":
        response = await setThumbnail(settings, interaction.options.getString("status"));
        break;

      case "color":
        response = await setColor(settings, interaction.options.getString("hex-code"));
        break;

      case "footer":
        response = await setFooter(settings, interaction.options.getString("content"));
        break;

      case "image":
        response = await setImage(settings, interaction.options.getString("url"));
        break;

      default:
        response = "Subcomando inválido";
    }

    return interaction.followUp(response);
  },
};

async function sendPreview(settings, member) {
  if (!settings.farewell?.enabled) return "Mensagem de despedida não ativada neste servidor";

  const targetChannel = member.guild.channels.cache.get(settings.farewell.channel);
  if (!targetChannel) return "Nenhum canal configurado para enviar a mensagem de despedida";

  const response = await buildGreeting(member, "FAREWELL", settings.farewell);
  await targetChannel.safeSend(response);

  return `Enviada prévia da despedida para ${targetChannel.toString()}`;
}

async function setStatus(settings, status) {
  const enabled = status.toUpperCase() === "ON" ? true : false;
  settings.farewell.enabled = enabled;
  await settings.save();
  return `Configuração salva! Mensagem de despedida ${
    status ? "ativada" : "desativada"
  }`;
}

async function setChannel(settings, channel) {
  if (!channel.canSendEmbeds()) {
    return (
      "Ah! Não consigo enviar saudações para esse canal. Preciso das permissões `Enviar Mensagens` e `Links de Incorporação` em " +
      channel.toString()
    );
  }
  settings.farewell.channel = channel.id;
  await settings.save();
  return `Configuração salva! A mensagem de despedida será enviada para ${channel ? channel.toString() : "Não encontrado"}`;
}

async function setDescription(settings, desc) {
  settings.farewell.embed.description = desc;
  await settings.save();
  return "Configuração salva! Mensagem de despedida atualizada";
}

async function setThumbnail(settings, status) {
  settings.farewell.embed.thumbnail = status.toUpperCase() === "ON" ? true : false;
  await settings.save();
  return "Configuração salva! Mensagem de despedida atualizada";
}

async function setColor(settings, color) {
  settings.farewell.embed.color = color;
  await settings.save();
  return "Configuração salva! Mensagem de despedida atualizada";
}

async function setFooter(settings, content) {
  settings.farewell.embed.footer = content;
  await settings.save();
  return "Configuração salva! Mensagem de despedida atualizada";
}

async function setImage(settings, url) {
  settings.farewell.embed.image = url;
  await settings.save();
  return "Configuração salva! Mensagem de despedida atualizada";
}
