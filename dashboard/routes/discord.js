const express = require("express"),
  router = express.Router();

const fetch = require("node-fetch"),
  btoa = require("btoa");

// Obtém a página de login
router.get("/login", async function (req, res) {
  // Verifica se não há usuário, ID do usuário ou guildas na requisição
  if (!req.user || !req.user.id || !req.user.guilds) {
    // Verifica se o usuário do cliente está pronto
    if (!req.client.user?.id) {
      req.client.logger.debug("O cliente não está pronto! Redirecionando para /login");
      return res.redirect("/login");
    }

    // Redireciona para a página de autorização do Discord
    return res.redirect(
      `https://discordapp.com/api/oauth2/authorize?client_id=${
        req.client.user.id
      }&scope=identify%20guilds&response_type=code&redirect_uri=${encodeURIComponent(
        req.client.config.DASHBOARD.baseURL + "/api/callback"
      )}&state=${req.query.state || "no"}`
    );
  }

  // Redireciona para a página de seleção
  res.redirect("/selector");
});

// Rota de retorno após a autorização
router.get("/callback", async (req, res) => {
  // Verifica se não há código na consulta
  if (!req.query.code) {
    req.client.logger.debug({ query: req.query, body: req.body });
    req.client.logger.error("Falha ao fazer login no painel! Verifique a pasta /logs para mais detalhes");
    return res.redirect(req.client.config.DASHBOARD.failureURL);
  }

  // Se o estado começar com "invite", manipula convites de guilda
  if (req.query.state && req.query.state.startsWith("invite")) {
    if (req.query.code) {
      const guildID = req.query.state.substr("invite".length, req.query.state.length);
      req.client.knownGuilds.push({ id: guildID, user: req.user.id });
      return res.redirect("/manage/" + guildID);
    }
  }

  // Obtém a URL de redirecionamento com base no estado ou usa "/selector" como padrão
  const redirectURL = req.client.states[req.query.state] || "/selector";

  // Prepara os parâmetros para a solicitação de token
  const params = new URLSearchParams();
  params.set("grant_type", "authorization_code");
  params.set("code", req.query.code);
  params.set("redirect_uri", `${req.client.config.DASHBOARD.baseURL}/api/callback`);

  // Solicitação de token usando o código de autorização
  let response = await fetch("https://discord.com/api/oauth2/token", {
    method: "POST",
    body: params.toString(),
    headers: {
      Authorization: `Basic ${btoa(`${req.client.user.id}:${process.env.BOT_SECRET}`)}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  // Obtem os tokens (usados para obter informações do usuário)
  const tokens = await response.json();

  // Se o código não for válido, redireciona para a página de login com o estado
  if (tokens.error || !tokens.access_token) {
    req.client.logger.debug(tokens);
    req.client.logger.error("Falha ao fazer login no painel! Verifique a pasta /logs para mais detalhes");
    return res.redirect(`/api/login&state=${req.query.state}`);
  }

  // Obtém informações do usuário e guildas de forma assíncrona
  const userData = {
    infos: null,
    guilds: null,
  };

  while (!userData.infos || !userData.guilds) {
    /* Informações do usuário */
    if (!userData.infos) {
      response = await fetch("https://discordapp.com/api/users/@me", {
        method: "GET",
        headers: { Authorization: `Bearer ${tokens.access_token}` },
      });
      const json = await response.json();
      if (json.retry_after) await req.client.wait(json.retry_after);
      else userData.infos = json;
    }

    /* Guildas do usuário */
    if (!userData.guilds) {
      response = await fetch("https://discordapp.com/api/users/@me/guilds", {
        method: "GET",
        headers: { Authorization: `Bearer ${tokens.access_token}` },
      });
      const json = await response.json();
      if (json.retry_after) await req.client.wait(json.retry_after);
      else userData.guilds = json;
    }
  }

  /* Converte o formato de guildas de { "0": { data }, "1": { data }, etc... } para [ { data }, { data } ]) */
  const guilds = [];
  for (const guildPos in userData.guilds) guilds.push(userData.guilds[guildPos]);

  // Atualiza a sessão do usuário com informações e guildas
  req.session.user = { ...userData.infos, ...{ guilds } }; // {user-info, guilds: [{}]}
  res.redirect(redirectURL);
});

// Exporta o roteador
module.exports = router;
