const { disconnectTarget } = require("@helpers/ModUtils");

module.exports = async ({ member }, target, reason) => {
  const response = await disconnectTarget(member, target, reason);
  if (typeof response === "boolean") {
    return `${target.user.username} is disconnected from the voice channel`;
  }
  if (response === "MEMBER_PERM") {
    return `Você não tem permissão para desconectar ${target.user.username}`;
  }
  if (response === "BOT_PERM") {
    return `Não tenho permissão para desconectar ${target.user.username}`;
  }
  if (response === "NO_VOICE") {
    return `${target.user.username} não está em nenhum canal de voz`;
  }
  return `Falha ao desconectar ${target.user.username}`;
};
