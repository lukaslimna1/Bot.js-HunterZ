const { ApplicationCommandOptionType } = require("discord.js");

/**
 * @type {import("@structures/Command")}
 */
module.exports = {
  name: "inviterank",
  description: "configurar classificações de convite",
  category: "INVITE",
  userPermissions: ["ManageGuild"],
  command: {
    enabled: true,
    usage: "<role-name> <invites>",
    minArgsCount: 2,
    subcommands: [
      {
        trigger: "add <role> <invites>",
        description: "adicione classificação automática após atingir um determinado número de convites",
      },
      {
        trigger: "remove role",
        description: "remover classificação de convite configurada com essa função",
      },
    ],
  },
  slashCommand: {
    enabled: true,
    ephemeral: true,
    options: [
      {
        name: "add",
        description: "adicione uma nova classificação de convite",
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: "role",
            description: "cargo a ser dado",
            type: ApplicationCommandOptionType.Role,
            required: true,
          },
          {
            name: "invites",
            description: "número de convites necessários para obter a função",
            type: ApplicationCommandOptionType.Integer,
            required: true,
          },
        ],
      },
      {
        name: "remove",
        description: "remover uma classificação de convite configurada anteriormente",
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: "role",
            description: "função com classificação de convite configurada",
            type: ApplicationCommandOptionType.Role,
            required: true,
          },
        ],
      },
    ],
  },

  async messageRun(message, args, data) {
    const sub = args[0].toLowerCase();

    if (sub === "add") {
      const query = args[1];
      const invites = args[2];

      if (isNaN(invites)) return message.safeReply(`\`${invites}\` não é um número válido de convites?`);
      const role = message.guild.findMatchingRoles(query)[0];
      if (!role) return message.safeReply(`Nenhuma função encontrada correspondente \`${query}\``);

      const response = await addInviteRank(message, role, invites, data.settings);
      await message.safeReply(response);
    }

    //
    else if (sub === "remove") {
      const query = args[1];
      const role = message.guild.findMatchingRoles(query)[0];
      if (!role) return message.safeReply(`Nenhuma função encontrada correspondente \`${query}\``);
      const response = await removeInviteRank(message, role, data.settings);
      await message.safeReply(response);
    }

    //
    else {
      await message.safeReply("Uso incorreto do comando!");
    }
  },

  async interactionRun(interaction, data) {
    const sub = interaction.options.getSubcommand();
    //
    if (sub === "add") {
      const role = interaction.options.getRole("role");
      const invites = interaction.options.getInteger("invites");

      const response = await addInviteRank(interaction, role, invites, data.settings);
      await interaction.followUp(response);
    }

    //
    else if (sub === "remove") {
      const role = interaction.options.getRole("role");
      const response = await removeInviteRank(interaction, role, data.settings);
      await interaction.followUp(response);
    }
  },
};

async function addInviteRank({ guild }, role, invites, settings) {
  if (!settings.invite.tracking) return `O rastreamento de convites está desativado neste servidor`;

  if (role.managed) {
    return "Você não pode atribuir uma função de bot";
  }

  if (guild.roles.everyone.id === role.id) {
    return "Não posso atribuir a função de todos.";
  }

  if (!role.editable) {
    return "Faltam permissões para mover membros para essa função. Essa função está abaixo da minha função mais elevada?";
  }

  const exists = settings.invite.ranks.find((obj) => obj._id === role.id);

  let msg = "";
  if (exists) {
    exists.invites = invites;
    msg += "Configuração anterior encontrada para esta função. Substituindo dados\n";
  } else {
    settings.invite.ranks.push({ _id: role.id, invites });
  }

  await settings.save();
  return `${msg}Sucesso! Configuração salva.`;
}

async function removeInviteRank({ guild }, role, settings) {
  if (!settings.invite.tracking) return `O rastreamento de convites está desativado neste servidor`;

  if (role.managed) {
    return "Você não pode atribuir uma função de bot";
  }

  if (guild.roles.everyone.id === role.id) {
    return "Você não pode atribuir a função de todos.";
  }

  if (!role.editable) {
    return "Faltam permissões para mover membros dessa função. Essa função está abaixo da minha função mais elevada?";
  }

  const exists = settings.invite.ranks.find((obj) => obj._id === role.id);
  if (!exists) return "Nenhuma classificação de convite anterior configurada foi encontrada para esta função";

  // delete element from array
  const i = settings.invite.ranks.findIndex((obj) => obj._id === role.id);
  if (i > -1) settings.invite.ranks.splice(i, 1);

  await settings.save();
  return "Sucesso! Configuração salva.";
}
