const { ApplicationCommandOptionType } = require("discord.js");

/**
 * @type {import("@structures/Comando")}
 */
module.exports = {
  nome: "autodelete",
  descricao: "gerenciar as configurações de autodelete para o servidor",
  categoria: "AUTOMOD",
  permissoesUsuario: ["GerenciarServidor"],
  comando: {
    habilitado: true,
    quantidadeArgumentosMinima: 2,
    subcomandos: [
      {
        acionador: "anexos <ligar|desligar>",
        descricao: "permitir ou proibir anexos em mensagens",
      },
      {
        acionador: "convites <ligar|desligar>",
        descricao: "permitir ou proibir convites em mensagens",
      },
      {
        acionador: "links <ligar|desligar>",
        descricao: "permitir ou proibir links em mensagens",
      },
      {
        acionador: "maxlinhas <número>",
        descricao: "define o número máximo de linhas permitidas por mensagem [0 para desativar]",
      },
    ],
  },
  slashComando: {
    habilitado: true,
    efemero: true,
    opcoes: [
      {
        nome: "anexos",
        descricao: "permitir ou proibir anexos em mensagens",
        tipo: ApplicationCommandOptionType.Subcomando,
        opcoes: [
          {
            nome: "status",
            descricao: "status da configuração",
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
        nome: "convites",
        descricao: "permitir ou proibir convites do Discord em mensagens",
        tipo: ApplicationCommandOptionType.Subcomando,
        opcoes: [
          {
            nome: "status",
            descricao: "status da configuração",
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
        nome: "links",
        descricao: "permitir ou proibir links em mensagens",
        tipo: ApplicationCommandOptionType.Subcomando,
        opcoes: [
          {
            nome: "status",
            descricao: "status da configuração",
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
        nome: "maxlinhas",
        descricao: "define o número máximo de linhas permitidas por mensagem",
        tipo: ApplicationCommandOptionType.Subcomando,
        opcoes: [
          {
            nome: "quantidade",
            descricao: "quantidade de configuração (0 para desativar)",
            obrigatorio: true,
            tipo: ApplicationCommandOptionType.Integer,
          },
        ],
      },
    ],
  },

  async executarMensagem(mensagem, argumentos, dados) {
    const configuracoes = dados.configuracoes;
    const subcomando = argumentos[0].toLowerCase();
    let resposta;

    if (subcomando == "anexos") {
      const status = argumentos[1].toLowerCase();
      if (!["ligar", "desligar"].includes(status)) return mensagem.safeReply("Status inválido. O valor deve ser `ligar/desligar`");
      resposta = await antiAnexos(configuracoes, status);
    }

    //
    else if (subcomando === "convites") {
      const status = argumentos[1].toLowerCase();
      if (!["ligar", "desligar"].includes(status)) return mensagem.safeReply("Status inválido. O valor deve ser `ligar/desligar`");
      resposta = await antiConvites(configuracoes, status);
    }

    //
    else if (subcomando == "links") {
      const status = argumentos[1].toLowerCase();
      if (!["ligar", "desligar"].includes(status)) return mensagem.safeReply("Status inválido. O valor deve ser `ligar/desligar`");
      resposta = await antiLinks(configuracoes, status);
    }

    //
    else if (subcomando === "maxlinhas") {
      const max = argumentos[1];
      if (isNaN(max) || Number.parseInt(max) < 1) {
        return mensagem.safeReply("O número máximo de linhas deve ser um número válido maior que 0");
      }
      resposta = await maxLinhas(configuracoes, max);
    }

    //
    else resposta = "Uso inválido do comando!";
    await mensagem.safeReply(resposta);
  },

  async executarInteracao(interacao, dados) {
    const subcomando = interacao.opcoes.getSubcomando();
    const configuracoes = dados.configuracoes;
    let resposta;

    if (subcomando == "anexos") {
      resposta = await antiAnexos(configuracoes, interacao.opcoes.getString("status"));
    } else if (subcomando === "convites") resposta = await antiConvites(configuracoes, interacao.opcoes.getString("status"));
    else if (subcomando == "links") resposta = await antiLinks(configuracoes, interacao.opcoes.getString("status"));
    else if (subcomando === "maxlinhas") resposta = await maxLinhas(configuracoes, interacao.opcoes.getInteger("quantidade"));
    else resposta = "Uso inválido do comando!";

    await interacao.followUp(resposta);
  },
};

async function antiAnexos(configuracoes, entrada) {
  const status = entrada.toUpperCase() === "LIGADO" ? true : false;
  configuracoes.automod.anti_anexos = status;
  await configuracoes.save();
  return `Mensagens ${
    status ? "com anexos serão automaticamente deletadas" : "não serão filtradas para anexos agora"
  }`;
}

async function antiConvites(configuracoes, entrada) {
  const status = entrada.toUpperCase() === "LIGADO" ? true : false;
  configuracoes.automod.anti_convites = status;
  await configuracoes.save();
  return `Mensagens ${
    status ? "com convites do Discord serão automaticamente deletadas" : "não serão filtradas para convites do Discord agora"
  }`;
}

async function antiLinks(configuracoes, entrada) {
  const status = entrada.toUpperCase() === "LIGADO" ? true : false;
  configuracoes.automod.anti_links = status;
  await configuracoes.save();
  return `Mensagens ${status ? "com links serão automaticamente deletadas" : "não serão filtradas para links agora"}`;
}

async function maxLinhas(configuracoes, entrada) {
  const linhas = Number.parseInt(entrada);
  if (isNaN(linhas)) return "Por favor, insira um número válido";

  configuracoes.automod.max_linhas = linhas;
  await configuracoes.save();
  return `${
    entrada === 0
      ? "O limite máximo de linhas está desativado"
      : `Mensagens com mais de \`${entrada}\` linhas serão automaticamente deletadas`
  }`;
}
