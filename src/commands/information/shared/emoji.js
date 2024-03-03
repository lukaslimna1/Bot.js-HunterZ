const { parseEmoji, EmbedBuilder } = require("discord.js");
const { EMBED_COLORS } = require("@root/config");

module.exports = (emoji) => {
  let custom = parseEmoji(emoji);
  if (!custom.id) return "Este não é um emoji de guilda válido";

  let url = `https://cdn.discordapp.com/emojis/${custom.id}.${custom.animated ? "gif?v=1" : "png"}`;

  const embed = new EmbedBuilder()
    .setColor(EMBED_COLORS.BOT_EMBED)
    .setAuthor({ name: "Emoji Info" })
    .setDescription(
      `**Id:** ${custom.id}\n` + `**Name:** ${custom.name}\n` + `**Animado:** ${custom.animated ? "Yes" : "No"}`
    )
    .setImage(url);

  return { embeds: [embed] };
};
