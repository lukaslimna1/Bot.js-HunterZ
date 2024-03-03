const { EmbedBuilder, AttachmentBuilder, ApplicationCommandOptionType } = require("discord.js");
const { getBuffer } = require("@helpers/HttpUtils");
const { getImageFromMessage } = require("@helpers/BotUtils");
const { EMBED_COLORS, IMAGE } = require("@root/config.js");

const availableOverlays = [
  "approved",
  "brazzers",
  "gay",
  "halloween",
  "rejected",
  "thuglife",
  "to-be-continued",
  "wasted",
];

/**
 * @type {import("@structures/Command")}
 */
module.exports = {
  name: "overlay",
  description: "adicione sobreposição sobre a imagem fornecida",
  cooldown: 5,
  category: "IMAGE",
  botPermissions: ["EmbedLinks", "AttachFiles"],
  command: {
    enabled: true,
    aliases: availableOverlays,
  },
  slashCommand: {
    enabled: true,
    options: [
      {
        name: "name",
        description: "o tipo de sobreposição",
        type: ApplicationCommandOptionType.String,
        required: true,
        choices: availableOverlays.map((overlay) => ({ name: overlay, value: overlay })),
      },
      {
        name: "user",
        description: "o usuário a cujo avatar a sobreposição precisa ser aplicada",
        type: ApplicationCommandOptionType.User,
        required: false,
      },
      {
        name: "link",
        description: "o link da imagem à qual a sobreposição precisa ser aplicada",
        type: ApplicationCommandOptionType.String,
        required: false,
      },
    ],
  },

  async messageRun(message, args, data) {
    const image = await getImageFromMessage(message, args);

    // use invoke as an endpoint
    const url = getOverlay(data.invoke.toLowerCase(), image);
    const response = await getBuffer(url, {
      headers: {
        Authorization: `O portador ${process.env.STRANGE_API_KEY}`,
      },
    });

    if (!response.success) return message.safeReply("Falha ao gerar imagem");

    const attachment = new AttachmentBuilder(response.buffer, { name: "attachment.png" });
    const embed = new EmbedBuilder()
      .setColor(EMBED_COLORS.TRANSPARENT)
      .setImage("attachment://attachment.png")
      .setFooter({ text: `Requerido por: ${message.author.username}` });

    await message.safeReply({ embeds: [embed], files: [attachment] });
  },

  async interactionRun(interaction) {
    const author = interaction.user;
    const user = interaction.options.getUser("user");
    const imageLink = interaction.options.getString("link");
    const filter = interaction.options.getString("name");

    let image;
    if (user) image = user.displayAvatarURL({ size: 256, extension: "png" });
    if (!image && imageLink) image = imageLink;
    if (!image) image = author.displayAvatarURL({ size: 256, extension: "png" });

    const url = getOverlay(filter, image);
    const response = await getBuffer(url, {
      headers: {
        Authorization: `O portador ${process.env.STRANGE_API_KEY}`,
      },
    });

    if (!response.success) return interaction.followUp("Falha ao gerar sobreposição de imagem");

    const attachment = new AttachmentBuilder(response.buffer, { name: "attachment.png" });
    const embed = new EmbedBuilder()
      .setColor(EMBED_COLORS.TRANSPARENT)
      .setImage("attachment://attachment.png")
      .setFooter({ text: `Requerido por: ${author.username}` });

    await interaction.followUp({ embeds: [embed], files: [attachment] });
  },
};

function getOverlay(filter, image) {
  const endpoint = new URL(`${IMAGE.BASE_API}/overlays/${filter}`);
  endpoint.searchParams.append("image", image);
  return endpoint.href;
}
