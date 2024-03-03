/**
 * @type {import("@structures/Command")}
 */
module.exports = {
  name: "ping",
  description: "mostra o ping atual do bot para os servidores discord",
  category: "INFORMATION",
  command: {
    enabled: true,
  },
  slashCommand: {
    enabled: true,
    ephemeral: true,
    options: [],
  },

  async messageRun(message, args) {
    await message.safeReply(`🏓 Pong : \`${Math.floor(message.client.ws.ping)}ms\``);
  },

  async interactionRun(interaction) {
    await interaction.followUp(`🏓 Pong : \`${Math.floor(interaction.client.ws.ping)}ms\``);
  },
};
