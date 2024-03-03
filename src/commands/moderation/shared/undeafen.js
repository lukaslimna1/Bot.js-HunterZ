const { unDeafenTarget } = require("@helpers/ModUtils");

module.exports = async ({ member }, target, reason) => {
  const response = await unDeafenTarget(member, target, reason);
  if (typeof response === "boolean") {
    return `${target.user.username} está surdo neste servidor`;
  }
  if (response === "MEMBER_PERM") {
    return `Você não tem permissão para ensurdecer ${target.user.username}`;
  }
  if (response === "BOT_PERM") {
    return `Eu não tenho permissão para ensurdecer ${target.user.username}`;
  }
  if (response === "NO_VOICE") {
    return `${target.user.username} não está em nenhum canal de voz`;
  }
  if (response === "NOT_DEAFENED") {
    return `${target.user.username} não está surdo`;
  }
  return `Failed to deafen ${target.user.username}`;
};
