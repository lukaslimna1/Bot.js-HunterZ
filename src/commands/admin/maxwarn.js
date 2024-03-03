const { ApplicationCommandOptionType } = require("discord.js");

/**
 * @type {import("@structures/Command")}
 */
module.exports = {
  name: "maxwarn",
  description: "definir configuração máxima de avisos",
  category: "ADMIN",
  userPermissions: ["ManageGuild"],
  command: {
    enabled: true,
    minArgsCount: 1,
    subcommands: [
      {
        trigger: "limit <number>",
        description: "definir o máximo de avisos que um membro pode receber antes de realizar uma ação",
      },
      {
        trigger: "action <timeout|kick|ban>",
        description: "definir ação para ser executada após receber avisos máximos",
      },
    ],
  },
  slashCommand: {
    enabled: true,
    ephemeral: true,
    options: [
      {
        name: "limit",
        description: "definir o máximo de avisos que um membro pode receber antes de realizar uma ação",
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: "amount",
            description: "número máximo de avisos",
            type: ApplicationCommandOptionType.Integer,
            required: true,
          },
        ],
      },
      {
        name: "action",
        description: "definir ação para ser executada após receber avisos máximos",
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: "action",
            description: "ação a realizar",
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
    ],
  },

  async messageRun(message, args, data) {
    const input = args[0].toLowerCase();
    if (!["limit", "action"].includes(input)) return message.safeReply("Uso de comando inválido");

    let response;
    if (input === "limit") {
      const max = parseInt(args[1]);
      if (isNaN(max) || max < 1) return message.safeReply("O máximo de avisos deve ser um número válido maior que 0");
      response = await setLimit(max, data.settings);
    }

    if (input === "action") {
      const action = args[1]?.toUpperCase();
      if (!action || !["TIMEOUT", "KICK", "BAN"].includes(action))
        return message.safeReply("Não é uma ação válida. A ação pode ser `Timeout`/`Kick`/`Ban`");
      response = await setAction(message.guild, action, data.settings);
    }

    await message.safeReply(response);
  },

  async interactionRun(interaction, data) {
    const sub = interaction.options.getSubcommand();

    let response;
    if (sub === "limit") {
      response = await setLimit(interaction.options.getInteger("amount"), data.settings);
    }

    if (sub === "action") {
      response = await setAction(interaction.guild, interaction.options.getString("action"), data.settings);
    }

    await interaction.followUp(response);
  },
};

async function setLimit(limit, settings) {
  settings.max_warn.limit = limit;
  await settings.save();
  return `Configuração salva! O máximo de avisos está definido para ${limit}`;
}

async function setAction(guild, action, settings) {
  if (action === "TIMEOUT") {
    if (!guild.members.me.permissions.has("ModerateMembers")) {
      return "Eu não tenho permissão para expirar membros";
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

  settings.max_warn.action = action;
  await settings.save();
  return `Configuração salva! A ação Automod está definida como ${action}`;
}
