const { vMuteTarget } = require("@helpers/ModUtils");

module.exports = async ({ member }, target, reason) => {
  const response = await vMuteTarget(member, target, reason);
  if (typeof response === "boolean") {
    return `${target.user.username}a voz de está silenciada neste servidor`;
  }
  if (response === "MEMBER_PERM") {
    return `Você não tem permissão para silenciar a voz ${target.user.username}`;
  }
  if (response === "BOT_PERM") {
    return `Eu não tenho permissão para silenciar a voz ${target.user.username}`;
  }
  if (response === "NO_VOICE") {
    return `${target.user.username} não está em nenhum canal de voz`;
  }
  if (response === "ALREADY_MUTED") {
    return `${target.user.username} já está silenciado`;
  }
  return `Failed to voice mute ${target.user.username}`;
};
