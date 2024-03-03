const { ApplicationCommandOptionType } = require("discord.js");

/**
 * @type {import("@structures/Comando")}
 */
module.exports = {
  nome: "anti",
  descricao: "gerenciar várias configurações de automod para o servidor",
  categoria: "AUTOMOD",
  permissoesUsuario: ["GerenciarServidor"],
  comando: {
    habilitado: true,
    quantidadeArgumentosMinima: 2,
    subcomandos: [
      {
        acionador: "ghostping <ligar|desligar>",
        descricao: "detecta e registra menções fantasmas no seu servidor",
      },
      {
        acionador: "spam <ligar|desligar>",
        descricao: "habilita ou desabilita a detecção de antispam",
      },
      {
        acionador: "massmention <ligar|desligar> [limite]",
        descricao: "habilita ou desabilita a detecção de menções em massa [o limite padrão é 3 menções]",
      },
    ],
  },
  slashComando: {
    habilitado: true,
    efemero: true,
    opcoes: [
      {
        nome: "ghostping",
        descricao: "detecta e registra menções fantasmas no seu servidor",
        tipo: ApplicationCommandOptionType.Subcomando,
        opcoes: [
          {
            nome: "status",
            descricao: "status de configuração",
            obrigatorio: true,
            tipo: ApplicationCommandOptionType.String,
            escolhas: [
              {
                nome: "LIGADO",
                valor: "LIGADO",
              },
              {
                nome: "DESLIGADO",
                valor: "DESLIGADO",
              },
            ],
          },
        ],
      },
      {
        nome: "spam",
        descricao: "habilita ou desabilita a detecção de antispam",
        tipo: ApplicationCommandOptionType.Subcomando,
        opcoes: [
          {
            nome: "status",
            descricao: "status de configuração",
            obrigatorio: true,
            tipo: ApplicationCommandOptionType.String,
            escolhas: [
              {
                nome: "LIGADO",
                valor: "LIGADO",
              },
              {
                nome: "DESLIGADO",
                valor: "DESLIGADO",
              },
            ],
          },
        ],
      },
      {
        nome: "massmention",
        descricao: "habilita ou desabilita a detecção de menções em massa",
        tipo: ApplicationCommandOptionType.Subcomando,
        opcoes: [
          {
            nome: "status",
            descricao: "status de configuração",
            obrigatorio: true,
            tipo: ApplicationCommandOptionType.String,
            escolhas: [
              {
                nome: "LIGADO",
                valor: "LIGADO",
              },
              {
                nome: "DESLIGADO",
                valor: "DESLIGADO",
              },
            ],
          },
          {
            nome: "limite",
            descricao: "limite de configuração (padrão é 3 menções)",
            obrigatorio: true,
            tipo: ApplicationCommandOptionType.Integer,
          },
        ],
      },
    ],
  },

  // Função para lidar com comandos de mensagem
  async executarMensagem(mensagem, argumentos, dados) {
    const configuracoes = dados.configuracoes;
    const subcomando = argumentos[0].toLowerCase();

    let resposta;
    if (subcomando == "ghostping") {
      const status = argumentos[1].toLowerCase();
      if (!["ligar", "desligar"].includes(status)) return mensagem.safeReply("Status inválido. O valor deve ser `ligar/desligar`");
      resposta = await antiGhostPing(configuracoes, status);
    } else if (subcomando == "spam") {
      const status = argumentos[1].toLowerCase();
      if (!["ligar", "desligar"].includes(status)) return mensagem.safeReply("Status inválido. O valor deve ser `ligar/desligar`");
      resposta = await antiSpam(configuracoes, status);
    } else if (subcomando === "massmention") {
      const status = argumentos[1].toLowerCase();
      const limite = argumentos[2] || 3;
      if (!["ligar", "desligar"].includes(status)) return mensagem.safeReply("Status inválido. O valor deve ser `ligar/desligar`");
      resposta = await antiMassMention(configuracoes, status, limite);
    } else resposta = "Uso inválido do comando!";
    await mensagem.safeReply(resposta);
  },

  // Função para lidar com comandos de interação (slash commands)
  async executarInteracao(interacao, dados) {
    const subcomando = interacao.opcoes.getSubcomando();
    const configuracoes = dados.configuracoes;

    let resposta;
    if (subcomando == "ghostping") resposta = await antiGhostPing(configuracoes, interacao.opcoes.getString("status"));
    else if (subcomando == "spam") resposta = await antiSpam(configuracoes, interacao.opcoes.getString("status"));
    else if (subcomando === "massmention") {
      resposta = await antiMassMention(
        configuracoes,
        interacao.opcoes.getString("status"),
        interacao.opcoes.getInteger("limite")
      );
    } else resposta = "Uso inválido do comando!";

    await interacao.followUp(resposta);
  },
};

// Função para lidar com a configuração Anti-Ghostping
async function antiGhostPing(configuracoes, entrada) {
  const status = entrada.toUpperCase() === "LIGADO" ? true : false;
  configuracoes.automod.anti_ghostping = status;
  await configuracoes.save();
  return `Configuração salva! Anti-Ghostping está agora ${status ? "habilitado" : "desabilitado"}`;
}

// Função para lidar com a configuração Antispam
async function antiSpam(configuracoes, entrada) {
  const status = entrada.toUpperCase() === "LIGADO" ? true : false;
  configuracoes.automod.anti_spam = status;
  await configuracoes.save();
  return `A detecção de antispam está agora ${status ? "habilitada" : "desabilitada"}`;
}

// Função para lidar com a configuração de Menção em Massa
async function antiMassMention(configuracoes, entrada, limite) {
  const status = entrada.toUpperCase() === "LIGADO" ? true : false;
  if (!status) {
    configuracoes.automod.anti_massmention = 0;
  } else {
    configuracoes.automod.anti_massmention = limite;
  }
  await configuracoes.save();
  return `A detecção de menção em massa está agora ${status ? "habilitada" : "desabilitada"}`;
}
