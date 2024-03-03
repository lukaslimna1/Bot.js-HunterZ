const { isHex } = require("@helpers/Utils");
const { buildGreeting } = require("@handlers/greeting");
const { ApplicationCommandOptionType, ChannelType } = require("discord.js");

/**
 * @type {import("@structures/Command")}
 */
module.exports = {
  name: "bemvindo",
  description: "configurar mensagem de boas-vindas",
  category: "ADMIN",
  userPermissions: ["ManageGuild"],
  command: {
    enabled: true,
    minArgsCount: 1,
    subcommands: [
      {
        trigger: "status <on|off>",
        description: "ativar ou desativar mensagem de boas-vindas",
      },
      {
        trigger: "channel <#canal>",
        description: "configurar mensagem de boas-vindas",
      },
      {
        trigger: "preview",
        description: "visualizar a mensagem de boas-vindas configurada",
      },
      {
        trigger: "desc <texto>",
        description: "definir descrição do embed",
      },
      {
        trigger: "thumbnail <on|off>",
        description: "ativar/desativar miniatura do embed",
      },
      {
        trigger: "color <códigohex>",
        description: "definir cor do embed",
      },
      {
        trigger: "footer <texto>",
        description: "definir conteúdo do rodapé do embed",
      },
      {
        trigger: "image <url>",
        description: "definir imagem do embed",
      },
    ],
  },
  slashCommand: {
    enabled: true,
    ephemeral: true,
    options: [
      {
        name: "status",
        description: "ativar ou desativar mensagem de boas-vindas",
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
        description: "visualizar a mensagem de boas-vindas configurada",
        type: ApplicationCommandOptionType.Subcommand,
      },
      {
        name: "channel",
        description: "definir canal de boas-vindas",
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: "canal",
            description: "nome do canal",
            type: ApplicationCommandOptionType.Channel,
            channelTypes: [ChannelType.GuildText],
            required: true,
          },
        ],
      },
      {
        name: "desc",
        description: "definir descrição do embed",
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: "conteudo",
            description: "conteúdo da descrição",
            type: ApplicationCommandOptionType.String,
            required: true,
          },
        ],
      },
      {
        name: "thumbnail",
        description: "configurar miniatura do embed",
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: "status",
            description: "status da miniatura",
            type: ApplicationCommandOptionType.String,
            required: true,
            choices: [
              {
                name: "on",
                value: "on",
              },
              {
                name: "on",
                value: "DESon",
              },
            ],
          },
        ],
      },
      {
        name: "color",
        description: "definir cor do embed",
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: "hex-code",
            description: "código de cor hex",
            type: ApplicationCommandOptionType.String,
            required: true,
          },
        ],
      },
      {
        name: "footer",
        description: "definir rodapé do embed",
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: "conteudo",
            description: "conteúdo do rodapé",
            type: ApplicationCommandOptionType.String,
            required: true,
          },
        ],
      },
      {
        name: "image",
        description: "definir imagem do embed",
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: "url",
            description: "url da imagem",
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

    // preview
    if (type === "preview") {
      response = await sendPreview(settings, message.member);
    }

    // status
    else if (type === "status") {
      const status = args[1]?.toUpperCase();
      if (!status || !["on", "on"].includes(status))
        return message.safeReply("Status inválido. O valor deve ser `on/on`");
      response = await setStatus(settings, status);
    }

    // channel
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

    // thumbnail
    else if (type === "thumbnail") {
      const status = args[1]?.toUpperCase();
      if (!status || !["on", "on"].includes(status))
        return message.safeReply("Status inválido. O valor deve ser `on/on`");
      response = await setThumbnail(settings, status);
    }

    // color
    else if (type === "color") {
      const color = args[1];
      if (!color || !isHex(color)) return message.safeReply("Cor inválida. O valor deve ser uma cor hex válida");
      response = await setColor(settings, color);
    }

    // footer
    else if (type === "footer") {
      if (args.length < 2) return message.safeReply("Argumentos insuficientes! Por favor, forneça um conteúdo válido");
      const content = args.slice(1).join(" ");
      response = await setFooter(settings, content);
    }

    // image
    else if (type === "image") {
      const url = args[1];
      if (!url) return message.safeReply("URL de imagem inválido. Por favor, forneça uma URL válida");
      response = await setImage(settings, url);
    }

    //
    else response = "Uso de comando inválido!";
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
  if (!settings.bemvindo?.enabled) return "Mensagem de boas-vindas não ativada neste servidor";

  const targetChannel = member.guild.channels.cache.get(settings.bemvindo.channel);
  if (!targetChannel) return "Nenhum canal configurado para enviar a mensagem de boas-vindas";

  const response = await buildGreeting(member, "BEM-VINDO", settings.bemvindo);
  await targetChannel.safeSend(response);

  return `Enviado prévia de boas-vindas para ${targetChannel.toString()}`;
}

async function setStatus(settings, status) {
  const enabled = status.toUpperCase() === "on" ? true : false;
  settings.bemvindo.enabled = enabled;
  await settings.save();
  return `Configuração salva! Mensagem de boas-vindas ${enabled ? "ativada" : "desativada"}`;
}

async function setChannel(settings, channel) {
  if (!channel.canSendEmbeds()) {
    return (
      "Ah! Não consigo enviar saudação para esse canal. Preciso das permissões `Escrever Mensagens` e `Links de Incorporação` em " +
      channel.toString()
    );
  }
  settings.bemvindo.channel = channel.id;
  await settings.save();
  return `Configuração salva! Mensagem de boas-vindas será enviada para ${channel ? channel.toString() : "Não encontrado"}`;
}

async function setDescription(settings, desc) {
  settings.bemvindo.embed.description = desc;
  await settings.save();
  return "Configuração salva! Mensagem de boas-vindas atualizada";
}

async function setThumbnail(settings, status) {
  settings.bemvindo.embed.thumbnail = status.toUpperCase() === "on" ? true : false;
  await settings.save();
  return "Configuração salva! Mensagem de boas-vindas atualizada";
}

async function setColor(settings, color) {
  settings.bemvindo.embed.color = color;
  await settings.save();
  return "Configuração salva! Mensagem de boas-vindas atualizada";
}

async function setFooter(settings, content) {
  settings.bemvindo.embed.footer = content;
  await settings.save();
  return "Configuração salva! Mensagem de boas-vindas atualizada";
}

async function setImage(settings, url) {
  settings.bemvindo.embed.image = url;
  await settings.save();
  return "Configuração salva! Mensagem de boas-vindas atualizada";
}
