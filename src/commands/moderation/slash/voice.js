const deafen = require("../shared/deafen");
const vmute = require("../shared/vmute");
const vunmute = require("../shared/vunmute");
const undeafen = require("../shared/undeafen");
const disconnect = require("../shared/disconnect");
const move = require("../shared/move");
const { ApplicationCommandOptionType, ChannelType } = require("discord.js");

/**
 * @type {import("@structures/Command")}
 */
module.exports = {
  name: "voice",
  description: "comandos de moderação de voz",
  category: "MODERATION",
  userPermissions: ["MuteMembers", "MoveMembers", "DeafenMembers"],
  botPermissions: ["MuteMembers", "MoveMembers", "DeafenMembers"],
  command: {
    enabled: true,
  },
  slashCommand: {
    enabled: true,
    options: [
      {
        name: "mute",
        description: "silenciar a voz de um membro",
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: "user",
            description: "o membro alvo",
            type: ApplicationCommandOptionType.User,
            required: true,
          },
          {
            name: "reason",
            description: "motivo para mudo",
            type: ApplicationCommandOptionType.String,
            required: false,
          },
        ],
      },
      {
        name: "unmute",
        description: "ativar o som da voz de um membro silenciado",
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: "user",
            description: "o membro alvo",
            type: ApplicationCommandOptionType.User,
            required: true,
          },
          {
            name: "reason",
            description: "motivo para ativar o som",
            type: ApplicationCommandOptionType.String,
            required: false,
          },
        ],
      },
      {
        name: "deafen",
        description: "ensurdeceu um membro no canal de voz",
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: "user",
            description: "o membro alvo",
            type: ApplicationCommandOptionType.User,
            required: true,
          },
          {
            name: "reason",
            description: "razão para ensurdecer",
            type: ApplicationCommandOptionType.String,
            required: false,
          },
        ],
      },
      {
        name: "undeafen",
        description: "deixar um membro surdo no canal de voz",
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: "user",
            description: "o membro alvo",
            type: ApplicationCommandOptionType.User,
            required: true,
          },
          {
            name: "reason",
            description: "razão para não surdo",
            type: ApplicationCommandOptionType.String,
            required: false,
          },
        ],
      },
      {
        name: "kick",
        description: "expulsar um membro do canal de voz",
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: "user",
            description: "o membro alvo",
            type: ApplicationCommandOptionType.User,
            required: true,
          },
          {
            name: "reason",
            description: "reason for mute",
            type: ApplicationCommandOptionType.String,
            required: false,
          },
        ],
      },
      {
        name: "move",
        description: "move a member from one voice channel to another",
        type: ApplicationCommandOptionType.Subcommand,
        options: [
          {
            name: "user",
            description: "o membro alvo",
            type: ApplicationCommandOptionType.User,
            required: true,
          },
          {
            name: "channel",
            description: "o canal para onde mover o membro",
            type: ApplicationCommandOptionType.Channel,
            channelTypes: [ChannelType.GuildVoice, ChannelType.GuildStageVoice],
            required: true,
          },
          {
            name: "reason",
            description: "motivo para mudo",
            type: ApplicationCommandOptionType.String,
            required: false,
          },
        ],
      },
    ],
  },

  async interactionRun(interaction) {
    const sub = interaction.options.getSubcommand();
    const reason = interaction.options.getString("reason");

    const user = interaction.options.getUser("user");
    const target = await interaction.guild.members.fetch(user.id);

    let response;

    if (sub === "mute") response = await vmute(interaction, target, reason);
    else if (sub === "unmute") response = await vunmute(interaction, target, reason);
    else if (sub === "deafen") response = await deafen(interaction, target, reason);
    else if (sub === "undeafen") response = await undeafen(interaction, target, reason);
    else if (sub === "kick") response = await disconnect(interaction, target, reason);
    else if (sub == "move") {
      const channel = interaction.options.getChannel("channel");
      response = await move(interaction, target, reason, channel);
    }

    await interaction.followUp(response);
  },
};
