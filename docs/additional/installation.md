# ✍ Guias

### Configurando Comandos de Barra

- Os comandos de barra estão desativados por padrão.
- No arquivo **config.js**, defina **SLASH = true** e **CONTEXT = true**, e substitua TEST_GUILD_ID pelo ID do servidor onde deseja testar inicialmente os comandos. Isso garantirá que todos os comandos sejam registrados imediatamente.
- Quando estiver satisfeito com os comandos, defina **GLOBAL = true** para registrar essas interações globalmente.

{% hint style="warning" %}
**Os comandos de barra globais** podem levar até 1 hora para aparecer em todos os servidores
{% endhint %}

### Configurando o Painel

- In the config.js, make sure you set dashboard enabled to **true**
- Add your baseURL, `http://localhost:8080/api/callback` in your application OAuth2 redirects page in the [discord developer portal](https://discord.com/developers/applications)

```
  DASHBOARD: {
    enabled: true, // enable or disable dashboard
    baseURL: "http://localhost:8080", // base url
    failureURL: "http://localhost:8080", // failure redirect url
    port: "8080", // port to run the bot on
  },
```
