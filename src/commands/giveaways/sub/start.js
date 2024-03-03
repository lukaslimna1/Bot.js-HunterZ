const { ChannelType } = require("discord.js");

/**
 * @param {import('discord.js').GuildMember} member
 * @param {import('discord.js').GuildTextBasedChannel} giveawayChannel
 * @param {number} duration
 * @param {string} prize
 * @param {number} winners
 * @param {import('discord.js').User} [host]
 * @param {string[]} [allowedRoles]
 */
module.exports = async (member, giveawayChannel, duration, prize, winners, host, allowedRoles = []) => {
  try {
    if (!host) host = member.user;
    if (!member.permissions.has("ManageMessages")) {
      return "Você precisa ter permissões de gerenciamento de mensagens para iniciar brindes.";
    }

    if (!giveawayChannel.type === ChannelType.GuildText) {
      return "Você só pode iniciar brindes em canais de texto.";
    }

    /**
     * @type {import("discord-giveaways").GiveawayStartOptions}
     */
    const options = {
      duration: duration,
      prize,
      winnerCount: winners,
      hostedBy: host,
      thumbnail: "https://i.imgur.com/DJuTuxs.png",
      messages: {
        giveaway: "🎉 **SORTEIO** 🎉",
        giveawayEnded: "🎉 **GIVEAWAY ENDED** 🎉",
        inviteToParticipate: "Reaja com 🎁 para entrar",
        dropMessage: "Seja o primeiro a reagir com 🎁 para ganhar!",
        hostedBy: `\n Hospedado por: ${host.username}`,
      },
    };

    if (allowedRoles.length > 0) {
      options.exemptMembers = (member) => !member.roles.cache.find((role) => allowedRoles.includes(role.id));
    }

    await member.client.giveawaysManager.start(giveawayChannel, options);
    return `O sorteio começou em ${giveawayChannel}`;
  } catch (error) {
    member.client.logger.error("Giveaway Start", error);
    return `Ocorreu um erro ao iniciar o sorteio: ${error.message}`;
  }
};
