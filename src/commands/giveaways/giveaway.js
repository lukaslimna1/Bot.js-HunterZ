const {
  ChannelType,
  ButtonBuilder,
  ActionRowBuilder,
  ComponentType,
  TextInputStyle,
  TextInputBuilder,
  ModalBuilder,
  ButtonStyle,
  ApplicationCommandOptionType,
} = require("discord.js");
const { parsePermissions } = require("@helpers/Utils");
const ems = require("enhanced-ms");

// Sub Commands
const start = require("./sub/start");
const pause = require("./sub/pause");
const resume = require("./sub/resume");
const end = require("./sub/end");
const reroll = require("./sub/reroll");
const list = require("./sub/list");
const edit = require("./sub/edit");

/**
 * @type {import("@structures/Command")}
 */
module.exports = {
  name: "giveaway",
  description: "comandos de sorteio",
  category: "GIVEAWAY",
  command: {
    enabled: true,
    minArgsCount: 1,
    subcommands: [
      {
        trigger: "start <#channel>",
        description: "configurar um novo sorteio",
      },
      {
        trigger: "pause <messageId>",
        description: "pausar um sorteio",
      },
      {
        trigger: "resume <messageId>",
        description: "retomar um sorteio pausado",
      },
      {
        trigger: "end <messageId>",
        description: "encerrar um sorteio",
      },
      {
        trigger: "reroll <messageId>",
        description: "relançar um sorteio",
      },
      {
        trigger: "list",
        description: "listar todos os sorteios",
      },
      {
        trigger: "edit <messageId>",
        description: "editar um sorteio",
      },
    ],
  },
  slashCommand: {
    enabled: true,
    ephemeral: true,
    options: [
      {
        name: "start",
        description: "começar um sorteio",
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: "channel",
            description: "o canal para iniciar o sorteio em",
            type: ApplicationCommandOptionType.Channel,
            channelTypes: [ChannelType.GuildText],
            required: true,
          },
        ],
      },
      {
        name: "pause",
        description: "pausar um sorteio",
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: "message_id",
            description: "o ID da mensagem do sorteio",
            type: ApplicationCommandOptionType.String,
            required: true,
          },
        ],
      },
      {
        name: "resume",
        description: "retomar um sorteio pausado",
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: "message_id",
            description: "o ID da mensagem do sorteio",
            type: ApplicationCommandOptionType.String,
            required: true,
          },
        ],
      },
      {
        name: "end",
        description: "encerrar um sorteio",
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: "message_id",
            description: "o ID da mensagem do sorteio",
            type: ApplicationCommandOptionType.String,
            required: true,
          },
        ],
      },
      {
        name: "reroll",
        description: "relançar um sorteio",
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: "message_id",
            description: "o ID da mensagem do sorteio",
            type: ApplicationCommandOptionType.String,
            required: true,
          },
        ],
      },
      {
        name: "list",
        description: "listar todos os sorteios",
        type: ApplicationCommandOptionType.Subcommand,
      },
      {
        name: "edit",
        description: "editar um sorteio",
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: "message_id",
            description: "o ID da mensagem do sorteio",
            type: ApplicationCommandOptionType.String,
            required: true,
          },
          {
            name: "add_duration",
            description: "o número de minutos a serem adicionados à duração do sorteio",
            type: ApplicationCommandOptionType.Integer,
            required: false,
          },
          {
            name: "new_prize",
            description: "o novo prêmio",
            type: ApplicationCommandOptionType.String,
            required: false,
          },
          {
            name: "new_winners",
            description: "o novo número de vencedores",
            type: ApplicationCommandOptionType.Integer,
            required: false,
          },
        ],
      },
    ],
  },

  async messageRun(message, args) {
    const sub = args[0]?.toLowerCase();
    let response;

    //
    if (sub === "start") {
      if (!args[1]) return message.safeReply("Uso incorreto! Forneça um canal para iniciar o sorteio em");
      const match = message.guild.findMatchingChannels(args[1]);
      if (!match.length) return message.safeReply(`Nenhum canal correspondente encontrado ${args[1]}`);
      return await runModalSetup(message, match[0]);
    }

    //
    else if (sub === "pause") {
      const messageId = args[1];
      response = await pause(message.member, messageId);
    }

    //
    else if (sub === "resume") {
      const messageId = args[1];
      response = await resume(message.member, messageId);
    }

    //
    else if (sub === "end") {
      const messageId = args[1];
      response = await end(message.member, messageId);
    }

    //
    else if (sub === "reroll") {
      const messageId = args[1];
      response = await reroll(message.member, messageId);
    }

    //
    else if (sub === "list") {
      response = await list(message.member);
    }

    //
    else if (sub === "edit") {
      const messageId = args[1];
      if (!messageId) return message.safeReply("Uso incorreto! Forneça um ID da mensagem");
      return await runModalEdit(message, messageId);
    }

    //
    else response = "Não é um subcomando válido";

    await message.safeReply(response);
  },

  async interactionRun(interaction) {
    const sub = interaction.options.getSubcommand();
    let response;

    //
    if (sub === "start") {
      const channel = interaction.options.getChannel("channel");
      await interaction.followUp("Iniciando sistema de Giveaway...");
      return await runModalSetup(interaction, channel);
    }

    //
    else if (sub === "pause") {
      const messageId = interaction.options.getString("message_id");
      response = await pause(interaction.member, messageId);
    }

    //
    else if (sub === "resume") {
      const messageId = interaction.options.getString("message_id");
      response = await resume(interaction.member, messageId);
    }

    //
    else if (sub === "end") {
      const messageId = interaction.options.getString("message_id");
      response = await end(interaction.member, messageId);
    }

    //
    else if (sub === "reroll") {
      const messageId = interaction.options.getString("message_id");
      response = await reroll(interaction.member, messageId);
    }

    //
    else if (sub === "list") {
      response = await list(interaction.member);
    }

    //
    else if (sub === "edit") {
      const messageId = interaction.options.getString("message_id");
      const addDur = interaction.options.getInteger("add_duration");
      const addDurationMs = addDur ? ems(addDur) : null;
      if (!addDurationMs) {
        return interaction.followUp("Não é uma duração válida");
      }
      const newPrize = interaction.options.getString("new_prize");
      const newWinnerCount = interaction.options.getInteger("new_winners");
      response = await edit(interaction.member, messageId, addDurationMs, newPrize, newWinnerCount);
    }

    //
    else response = "Subcomando inválido";

    await interaction.followUp(response);
  },
};

// Modal Giveaway setup
/**
 * @param {import('discord.js').Message|import('discord.js').CommandInteraction} args0
 * @param {import('discord.js').GuildTextBasedChannel} targetCh
 */
async function runModalSetup({ member, channel, guild }, targetCh) {
  const SETUP_PERMS = ["ViewChannel", "SendMessages", "EmbedLinks"];

  // validate channel perms
  if (!targetCh) return channel.safeSend("A configuração do sorteio foi cancelada. Você não mencionou um canal");
  if (!targetCh.type === ChannelType.GuildText && !targetCh.permissionsFor(guild.members.me).has(SETUP_PERMS)) {
    return channel.safeSend(
      `A configuração do sorteio foi cancelada.\n Preciso ${parsePermissions(SETUP_PERMS)} em ${targetCh}`
    );
  }

  const buttonRow = new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId("giveaway_btnSetup").setLabel("Configurar Sorteio").setStyle(ButtonStyle.Primary)
  );

  const sentMsg = await channel.safeSend({
    content: "Clique no botão abaixo para configurar um novo sorteio",
    components: [buttonRow],
  });

  if (!sentMsg) return;

  const btnInteraction = await channel
    .awaitMessageComponent({
      componentType: ComponentType.Button,
      filter: (i) => i.customId === "giveaway_btnSetup" && i.member.id === member.id && i.message.id === sentMsg.id,
      time: 20000,
    })
    .catch((ex) => {});

  if (!btnInteraction) return sentMsg.edit({ content: "Nenhuma resposta recebida, cancelando a configuração", components: [] });

  // display modal
  await btnInteraction.showModal(
    new ModalBuilder({
      customId: "giveaway-modalSetup",
      title: "Giveaway Setup",
      components: [
        new ActionRowBuilder().addComponents(
          new TextInputBuilder()
            .setCustomId("duration")
            .setLabel("Qual é a duração?")
            .setPlaceholder("1h / 1d / 1w")
            .setStyle(TextInputStyle.Short)
            .setRequired(true)
        ),
        new ActionRowBuilder().addComponents(
          new TextInputBuilder()
            .setCustomId("prize")
            .setLabel("Qual é o prêmio?")
            .setStyle(TextInputStyle.Short)
            .setRequired(true)
        ),
        new ActionRowBuilder().addComponents(
          new TextInputBuilder()
            .setCustomId("winners")
            .setLabel("Número de vencedores?")
            .setStyle(TextInputStyle.Short)
            .setRequired(true)
        ),
        new ActionRowBuilder().addComponents(
          new TextInputBuilder()
            .setCustomId("roles")
            .setLabel("RoleId's que podem participar do sorteio")
            .setStyle(TextInputStyle.Short)
            .setRequired(false)
        ),
        new ActionRowBuilder().addComponents(
          new TextInputBuilder()
            .setCustomId("host")
            .setLabel("ID do usuário que hospeda o sorteio")
            .setStyle(TextInputStyle.Short)
            .setRequired(false)
        ),
      ],
    })
  );

  // receive modal input
  const modal = await btnInteraction
    .awaitModalSubmit({
      time: 1 * 60 * 1000,
      filter: (m) => m.customId === "giveaway-modalSetup" && m.member.id === member.id && m.message.id === sentMsg.id,
    })
    .catch((ex) => {});

  if (!modal) return sentMsg.edit({ content: "Nenhuma resposta recebida, cancelando a configuração", components: [] });

  sentMsg.delete().catch(() => {});
  await modal.reply("Preparando sorteio...");

  // duration
  const duration = ems(modal.fields.getTextInputValue("duration"));
  if (isNaN(duration)) return modal.editReply("A configuração foi cancelada. Você não especificou uma duração válida");

  // prize
  const prize = modal.fields.getTextInputValue("prize");

  // winner count
  const winners = parseInt(modal.fields.getTextInputValue("winners"));
  if (isNaN(winners)) return modal.editReply("A configuração foi cancelada. Você não especificou uma contagem de vencedores válida");

  // roles
  const allowedRoles =
    modal.fields
      .getTextInputValue("roles")
      ?.split(",")
      ?.filter((roleId) => guild.roles.cache.get(roleId.trim())) || [];

  // host
  const hostId = modal.fields.getTextInputValue("host");
  let host = null;
  if (hostId) {
    try {
      host = await guild.client.users.fetch(hostId);
    } catch (ex) {
      return modal.editReply("A configuração foi cancelada. Você precisa fornecer um ID de usuário válido para o host");
    }
  }

  const response = await start(member, targetCh, duration, prize, winners, host, allowedRoles);
  await modal.editReply(response);
}

// Interactive Giveaway Update
/**
 * @param {import('discord.js').Message} message
 * @param {string} messageId
 */
async function runModalEdit(message, messageId) {
  const { member, channel } = message;

  const buttonRow = new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId("giveaway_btnEdit").setLabel("Editar Sorteio").setStyle(ButtonStyle.Primary)
  );

  const sentMsg = await channel.send({
    content: "Clique no botão abaixo para editar o sorteio",
    components: [buttonRow],
  });

  const btnInteraction = await channel
    .awaitMessageComponent({
      componentType: ComponentType.Button,
      filter: (i) => i.customId === "giveaway_btnEdit" && i.member.id === member.id && i.message.id === sentMsg.id,
      time: 20000,
    })
    .catch((ex) => {});

  if (!btnInteraction) return sentMsg.edit({ content: "Nenhuma resposta recebida, cancelando a atualização", components: [] });

  // display modal
  await btnInteraction.showModal(
    new ModalBuilder({
      customId: "giveaway-modalEdit",
      title: "Giveaway Update",
      components: [
        new ActionRowBuilder().addComponents(
          new TextInputBuilder()
            .setCustomId("duration")
            .setLabel("Duração para adicionar")
            .setPlaceholder("1h / 1d / 1w")
            .setStyle(TextInputStyle.Short)
            .setRequired(false)
        ),
        new ActionRowBuilder().addComponents(
          new TextInputBuilder()
            .setCustomId("prize")
            .setLabel("Qual é o novo prêmio?")
            .setStyle(TextInputStyle.Short)
            .setRequired(false)
        ),
        new ActionRowBuilder().addComponents(
          new TextInputBuilder()
            .setCustomId("winners")
            .setLabel("Número de vencedores?")
            .setStyle(TextInputStyle.Short)
            .setRequired(false)
        ),
      ],
    })
  );

  // receive modal input
  const modal = await btnInteraction
    .awaitModalSubmit({
      time: 1 * 60 * 1000,
      filter: (m) => m.customId === "giveaway-modalEdit" && m.member.id === member.id && m.message.id === sentMsg.id,
    })
    .catch((ex) => {});

  if (!modal) return sentMsg.edit({ content: "Nenhuma resposta recebida, cancelando a atualização", components: [] });

  sentMsg.delete().catch(() => {});
  await modal.reply("Atualizando o sorteio...");

  // duration
  const addDuration = ems(modal.fields.getTextInputValue("duration"));
  if (isNaN(addDuration)) return modal.editReply("A atualização foi cancelada. Você não especificou uma duração de adição válida");

  // prize
  const newPrize = modal.fields.getTextInputValue("prize");

  // winner count
  const newWinnerCount = parseInt(modal.fields.getTextInputValue("winners"));
  if (isNaN(newWinnerCount)) {
    return modal.editReply("A atualização foi cancelada. Você não especificou uma contagem de vencedores válida");
  }

  const response = await edit(message.member, messageId, addDuration, newPrize, newWinnerCount);
  await modal.editReply(response);
}
