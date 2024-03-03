const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");
const { getJson } = require("@helpers/HttpUtils");
const { EMBED_COLORS } = require("@root/config");
const NekosLife = require("nekos.life");
const neko = new NekosLife();

const choices = ["hug", "kiss", "cuddle", "feed", "pat", "poke", "slap", "smug", "tickle", "wink"];

/**
 * @type {import("@structures/Command")}
 */
module.exports = {
  name: "react",
  description: "reações de anime",
  enabled: true,
  category: "ANIME",
  cooldown: 5,
  command: {
    enabled: true,
    minArgsCount: 1,
    usage: "[reaction]",
  },
  slashCommand: {
    enabled: true,
    options: [
      {
        name: "category",
        description: "tipo de reação",
        type: ApplicationCommandOptionType.String,
        required: true,
        choices: choices.map((ch) => ({ name: ch, value: ch })),
      },
    ],
  },

  async messageRun(message, args) {
    const category = args[0].toLowerCase();
    if (!choices.includes(category)) {
      return message.safeReply(`Escolha inválida: \`${category}\`.\n Reações disponíveis: ${choices.join(", ")}`);
    }

    const embed = await genReaction(category, message.author);
    await message.safeReply({ embeds: [embed] });
  },

  async interactionRun(interaction) {
    const choice = interaction.options.getString("category");
    const embed = await genReaction(choice, interaction.user);
    await interaction.followUp({ embeds: [embed] });
  },
};

const genReaction = async (category, user) => {
  try {
    let imageUrl;

    // some-random api
    if (category === "wink") {
      const response = await getJson("https://some-random-api.com/animu/wink");
      if (!response.success) throw new Error("API error");
      imageUrl = response.data.link;
    }

    // neko api
    else {
      imageUrl = (await neko[category]()).url;
    }

    return new EmbedBuilder()
      .setImage(imageUrl)
      .setColor("Random")
      .setFooter({ text: `Requested By ${user.tag}` });
  } catch (ex) {
    return new EmbedBuilder()
      .setColor(EMBED_COLORS.ERROR)
      .setDescription("Falha ao buscar o meme. Tente novamente!")
      .setFooter({ text: `Requested By ${user.tag}` });
  }
};
