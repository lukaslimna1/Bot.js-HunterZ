const { moveTarget } = require("@helpers/ModUtils");

module.exports = async ({ member }, target, reason, channel) => {
  const response = await moveTarget(member, target, reason, channel);
  if (typeof response === "boolean") {
    return `${target.user.username} foi movido com sucesso para: ${channel}`;
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
  if (response === "TARGET_PERM") {
    return `${target.user.username} não tem permissão para participar ${channel}`;
  }
  if (response === "ALREADY_IN_CHANNEL") {
    return `${target.user.username} já está conectado a ${channel}`;
  }
  return `Failed to move ${target.user.username} to ${channel}`;
};
