const { EmbedBuilder, ApplicationCommandOptionType, ChannelType } = require("discord.js");
const { EMBED_COLORS } = require("@root/config.js");
const { stripIndent } = require("common-tags");

/**
 * @type {import("@structures/Command")}
 */
module.exports = {
  name: "automod",
  description: "várias configurações de automoderação",
  category: "AUTOMOD",
  userPermissions: ["ManageGuild"],
  command: {
    enabled: true,
    minArgsCount: 1,
    subcommands: [
      {
        trigger: "status",
        description: "verificar a configuração de automoderação para este servidor",
      },
      {
        trigger: "strikes <number>",
        description: "número máximo de advertências que um membro pode receber antes de tomar uma ação",
      },
      {
        trigger: "action <TIMEOUT|KICK|BAN>",
        description: "definir ação a ser executada após receber o número máximo de advertências",
      },
      {
        trigger: "debug <on|off>",
        description: "ativa/desativa automoderação para mensagens enviadas por administradores e moderadores",
      },
      {
        trigger: "whitelist",
        description: "lista de canais que estão na lista branca",
      },
      {
        trigger: "whitelistadd <channel>",
        description: "adicionar um canal à lista branca",
      },
      {
        trigger: "whitelistremove <channel>",
        description: "remover um canal da lista branca",
      },
    ],
  },
  slashCommand: {
    enabled: true,
    ephemeral: true,
    options: [
      {
        name: "status",
        description: "verificar a configuração de automoderação",
        type: ApplicationCommandOptionType.Subcommand,
      },
      {
        name: "strikes",
        description: "definir número máximo de advertências antes de tomar uma ação",
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: "amount",
            description: "número de advertências (padrão 5)",
            required: true,
            type: ApplicationCommandOptionType.Integer,
          },
        ],
      },
      {
        name: "action",
        description: "definir ação a ser executada após receber o número máximo de advertências",
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: "action",
            description: "ação a ser executada",
            type: ApplicationCommandOptionType.String,
            required: true,
            choices: [
              {
                name: "TIMEOUT",
                value: "TIMEOUT",
              },
              {
                name: "KICK",
                value: "KICK",
              },
              {
                name: "BAN",
                value: "BAN",
              },
            ],
          },
        ],
      },
      {
        name: "debug",
        description: "ativar/desativar automoderação para mensagens enviadas por administradores e moderadores",
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: "status",
            description: "status da configuração",
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
        name: "whitelist",
        description: "ver canais na lista branca",
        type: ApplicationCommandOptionType.Subcommand,
      },
      {
        name: "whitelistadd",
        description: "adicionar um canal à lista branca",
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: "channel",
            description: "canal para adicionar",
            required: true,
            type: ApplicationCommandOptionType.Channel,
            channelTypes: [ChannelType.GuildText],
          },
        ],
      },
      {
        name: "whitelistremove",
        description: "remover um canal da lista branca",
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: "channel",
            description: "canal para remover",
            required: true,
            type: ApplicationCommandOptionType.Channel,
            channelTypes: [ChannelType.GuildText],
          },
        ],
      },
    ],
  },

  async messageRun(message, args, data) {
    const input = args[0].toLowerCase();
    const settings = data.settings;

    let response;
    if (input === "status") {
      response = await getStatus(settings, message.guild);
    } else if (input === "strikes") {
      const strikes = args[1];
      if (isNaN(strikes) || Number.parseInt(strikes) < 1) {
        return message.safeReply("Advertências devem ser um número válido maior que 0");
      }
      response = await setStrikes(settings, strikes);
    } else if (input === "action") {
      const action = args[1].toUpperCase();
      if (!action || !["TIMEOUT", "KICK", "BAN"].includes(action))
        return message.safeReply("Ação inválida. A ação pode ser `Timeout`/`Kick`/`Ban`");
      response = await setAction(settings, message.guild, action);
    } else if (input === "debug") {
      const status = args[1].toLowerCase();
      if (!["on", "off"].includes(status)) return message.safeReply("Status inválido. O valor deve ser `on/off`");
      response = await setDebug(settings, status);
    }

    // lista branca
    else if (input === "whitelist") {
      response = getWhitelist(message.guild, settings);
    }

    // adicionar à lista branca
    else if (input === "whitelistadd") {
      const match = message.guild.findMatchingChannels(args[1]);
      if (!match.length) return message.safeReply(`Nenhum canal encontrado correspondente a ${args[1]}`);
      response = await whiteListAdd(settings, match[0].id);
    }

    // remover da lista branca
    else if (input === "whitelistremove") {
      const match = message.guild.findMatchingChannels(args[1]);
      if (!match.length) return message.safeReply(`Nenhum canal encontrado correspondente a ${args[1]}`);
      response = await whiteListRemove(settings, match[0].id);
    }

    //
    else response = "Uso inválido do comando!";
    await message.safeReply(response);
  },

  async interactionRun(interaction, data) {
    const sub = interaction.options.getSubcommand();
    const settings = data.settings;

    let response;

    if (sub === "status") response = await getStatus(settings, interaction.guild);
    else if (sub === "strikes") response = await setStrikes(settings, interaction.options.getInteger("amount"));
    else if (sub === "action")
      response = await setAction(settings, interaction.guild, interaction.options.getString("action"));
    else if (sub === "debug") response = await setDebug(settings, interaction.options.getString("status"));
    else if (sub === "whitelist") {
      response = getWhitelist(interaction.guild, settings);
    } else if (sub === "whitelistadd") {
      const channelId = interaction.options.getChannel("channel").id;
      response = await whiteListAdd(settings, channelId);
    } else if (sub === "whitelistremove") {
      const channelId = interaction.options.getChannel("channel").id;
      response = await whiteListRemove(settings, channelId);
    }

    await interaction.followUp(response);
  },
};

async function getStatus(settings, guild) {
  const { automod } = settings;

  const logChannel = settings.modlog_channel
    ? guild.channels.cache.get(settings.modlog_channel).toString()
    : "Não Configurado";

  // Construtor de String
  let desc = stripIndent`
    ❯ **Máximo de Linhas**: ${automod.max_lines || "NA"}
    ❯ **Anti-Massmention**: ${automod.anti_massmention > 0 ? "✓" : "✕"}
    ❯ **Anti-Anexo**: ${automod.anti_attachment ? "✓" : "✕"}
    ❯ **Anti-Links**: ${automod.anti_links ? "✓" : "✕"}
    ❯ **Anti-Convites**: ${automod.anti_invites ? "✓" : "✕"}
    ❯ **Anti-Spam**: ${automod.anti_spam ? "✓" : "✕"}
    ❯ **Anti-Ghostping**: ${automod.anti_ghostping ? "✓" : "✕"}
  `;

  const embed = new EmbedBuilder()
    .setAuthor({ name: "Configuração do Automoderação", iconURL: guild.iconURL() })
    .setColor(EMBED_COLORS.BOT_EMBED)
    .setDescription(desc)
    .addFields(
      {
        name: "Canal de Log",
        value: logChannel,
        inline: true,
      },
      {
        name: "Máximo de Advertências",
        value: automod.strikes.toString(),
        inline: true,
      },
      {
        name: "Ação",
        value: automod.action,
        inline: true,
      },
      {
        name: "Debug",
        value: automod.debug ? "✓" : "✕",
        inline: true,
      }
    );

  return { embeds: [embed] };
}

async function setStrikes(settings, strikes) {
  settings.automod.strikes = strikes;
  await settings.save();
  return `Configuração salva! Máximo de advertências definido como ${strikes}`;
}

async function setAction(settings, guild, action) {
  if (action === "TIMEOUT") {
    if (!guild.members.me.permissions.has("ModerateMembers")) {
      return "Não tenho permissão para dar um tempo em membros";
    }
  }

  if (action === "KICK") {
    if (!guild.members.me.permissions.has("KickMembers")) {
      return "Não tenho permissão para expulsar membros";
    }
  }

  if (action === "BAN") {
    if (!guild.members.me.permissions.has("BanMembers")) {
      return "Não tenho permissão para banir membros";
    }
  }

  settings.automod.action = action;
  await settings.save();
  return `Configuração salva! Ação do Automoderação definida como ${action}`;
}

async function setDebug(settings, input) {
  const status = input.toLowerCase() === "on" ? true : false;
  settings.automod.debug = status;
  await settings.save();
  return `Configuração salva! Debug do Automoderação agora está ${status ? "ativado" : "desativado"}`;
}

function getWhitelist(guild, settings) {
  const whitelist = settings.automod.wh_channels;
  if (!whitelist || !whitelist.length) return "Nenhum canal está na lista branca";

  const channels = [];
  for (const channelId of whitelist) {
    const channel = guild.channels.cache.get(channelId);
    if (!channel) continue;
    if (channel) channels.push(channel.toString());
  }

  return `Canais na lista branca: ${channels.join(", ")}`;
}

async function whiteListAdd(settings, channelId) {
  if (settings.automod.wh_channels.includes(channelId)) return "Canal já está na lista branca";
  settings.automod.wh_channels.push(channelId);
  await settings.save();
  return `Canal adicionado à lista branca!`;
}

async function whiteListRemove(settings, channelId) {
  if (!settings.automod.wh_channels.includes(channelId)) return "Canal não está na lista branca";
  settings.automod.wh_channels.splice(settings.automod.wh_channels.indexOf(channelId), 1);
  await settings.save();
  return `Canal removido da lista branca!`;
}
