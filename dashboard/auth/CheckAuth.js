module.exports = async (req, res, next) => {
  // Verifica se não há um usuário na sessão
  if (!req.session.user) {
    // Obtém a URL original da requisição e verifica se contém "login" ou é "/".
    // Define a URL de redirecionamento com base nisso.
    const redirectURL = req.originalUrl.includes("login") || req.originalUrl === "/" ? "/selector" : req.originalUrl;

    // Gera um estado aleatório e o armazena no objeto 'states' no cliente (req.client).
    const state = Math.random().toString(36).substring(5);
    req.client.states[state] = redirectURL;

    // Redireciona para a rota de login com o estado gerado
    return res.redirect(`/api/login?state=${state}`);
  }

  // Se houver um usuário na sessão, permite que a requisição continue para o próximo middleware
  return next();
};
