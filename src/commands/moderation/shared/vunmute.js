const { vUnmuteTarget } = require("@helpers/ModUtils");

module.exports = async ({ member }, target, reason) => {
  const response = await vUnmuteTarget(member, target, reason);
  if (typeof response === "boolean") {
    return `${target.user.username}'a voz está ativada neste servidor`;
  }
  if (response === "MEMBER_PERM") {
    return `Você não tem permissão para ativar o som de voz ${target.user.username}`;
  }
  if (response === "BOT_PERM") {
    return `Não tenho permissão para ativar o som da voz ${target.user.username}`;
  }
  if (response === "NO_VOICE") {
    return `${target.user.username} não está em nenhum canal de voz`;
  }
  if (response === "NOT_MUTED") {
    return `${target.user.username} a voz não está silenciada`;
  }
  return `Failed to voice unmute ${target.user.username}`;
};
