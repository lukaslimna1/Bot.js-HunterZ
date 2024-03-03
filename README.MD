## HunterZ - Bot Discord Multifuncional

O bot HunterZ é um bot Discord multifuncional desenvolvido para facilitar a interação e o gerenciamento em servidores Discord. Abaixo estão algumas das principais características e funcionalidades do bot:

### Funcionalidades Principais:

1. **Dashboard Web**:
   - Interface web para configuração e gerenciamento fácil.
   - Módulo de autenticação para segurança e controle de acesso.

2. **Comandos Diversos**:
   - Variedade de comandos categorizados, incluindo administração, entretenimento, economia, moderação, música, utilitários, etc.

3. **Estrutura de Comandos**:
   - Organização em categorias para facilitar a navegação e utilização.

4. **Sistema de Documentação**:
   - Documentação detalhada disponível no diretório `docs`, incluindo informações sobre comandos, contextos e outros aspectos do projeto.

5. **Registros e Logs**:
   - Registros detalhados das atividades do bot, incluindo logs diários para referência.

6. **Manipuladores de Eventos**:
   - Uso de manipuladores de eventos para lidar com diversas interações no Discord, como mensagens, reações, convites, etc.

7. **Gerenciamento de Banco de Dados**:
   - Scripts e configurações para o gerenciamento do banco de dados, com esquemas definidos no diretório `src/database`.

8. **Utilitários e Estruturas**:
   - Utilitários e estruturas implementados nos diretórios `src/helpers` e `src/structures` para facilitar o desenvolvimento e manutenção.

### Tradução para Português BR:

- Os comandos do bot foram traduzidos para o português BR para proporcionar uma experiência mais amigável aos usuários brasileiros.

# HunterZ

Este é o repositório do projeto HunterZ, um bot Discord multifuncional. Abaixo estão listados os principais diretórios e arquivos presentes neste projeto.

## Estrutura de Diretórios

- **.husky**: Configurações para o Husky, utilizado para ganchos de Git.
  - `pre-commit`: Script pré-commit do Git.

- **dashboard**: Código fonte relacionado à interface web do bot.
  - `auth`: Módulo de autenticação.
  - `public`: Recursos públicos da interface.
  - `routes`: Rotas da aplicação.
  - `views`: Páginas HTML da interface.
  - `app.js`: Arquivo principal da aplicação.
  - `utils.js`: Utilitários diversos.

- **docs**: Documentação do projeto.
  - `.gitbook`: Configurações do GitBook.
  - `additional`: Documentação adicional.
  - `commands`: Documentação dos comandos.
  - `contexts.md`: Documentação sobre os contextos.
  - `SUMMARY.md`: Sumário da documentação.

- **logs**: Logs gerados pela aplicação.
  - `.gitkeep`: Arquivo de espaço reservado.
  - `combined-2024.3.1.log`: Log do dia 1 de março de 2024.
  - `combined-2024.3.2.log`: Log do dia 2 de março de 2024.

- **node_modules**: Dependências do projeto.

- **scripts**: Scripts diversos.
  - `db-v4-to-v5.js`: Script para migração de banco de dados.

- **src**: Código-fonte principal do bot.
  - `commands`: Comandos do bot, organizados por categorias.
  - `contexts`: Contextos utilizados nos comandos.
  - `database`: Configurações e esquemas do banco de dados.
  - `events`: Manipuladores de eventos Discord.
  - `handlers`: Manipuladores de funcionalidades específicas.
  - `helpers`: Utilitários diversos.
  - `structures`: Estruturas base do bot.
  - `data.json`: Dados do projeto.

- **Arquivos na raiz do projeto**:
  - `.dockerignore`: Configurações de exclusão para Docker.
  - `.env`: Arquivo de ambiente.
  - `.eslintrc.json`: Configurações do ESLint.
  - `.gitbook.yaml`: Configurações do GitBook.
  - `.prettierrc.json`: Configurações do Prettier.
  - `.replit`: Configurações para a plataforma Replit.
  - `bot.js`: Arquivo principal do bot.
  - `config.js`: Configurações gerais do projeto.
  - `docker-compose.yml`: Configurações do Docker Compose.
  - `dockerfile`: Arquivo de configuração do Docker.
  - `jsconfig.json`: Configurações do projeto JavaScript.
  - `LICENSE`: Licença do projeto.
  - `package-lock.json`: Versões específicas das dependências.
  - `package.json`: Informações sobre o projeto.
  - `Procfile`: Arquivo de especificação do Procfile.

Este README fornece uma visão geral da estrutura do projeto HunterZ. Consulte a documentação específica nos diretórios relevantes para obter informações detalhadas sobre cada componente.


### Base do Repositório Existente:

- Este bot está sendo desenvolvido com base na estrutura existente do repositório [discord-js-bot](https://github.com/saiteja-madha/discord-js-bot/tree/main). A estrutura original foi adaptada e expandida para atender às necessidades específicas do projeto HunterZ.

### Configuração e Execução:

- Utilização de arquivos de configuração como `.env` para configurações sensíveis.
- Arquivo `docker-compose.yml` disponível para empacotamento e execução em ambientes Docker.

### Desenvolvimento e Contribuições:

- Código organizado em diretórios específicos para facilitar colaboração e desenvolvimento contínuo.
- Utilização de ferramentas como ESLint e Prettier para manter um código limpo e consistente.

### Licença:

- O projeto é licenciado sob os termos especificados no arquivo `LICENSE`.


### Em Breve

 - Estaremos reestrutrando o sistema de economia, para que não seja só um jogo.
 - O novo sistema de economia é baseado para clãs/Guildas de jogos online.
 - O Novo sistema tera uma moeda propria , sistema de loja e leião, sendo possivel a venda de obejetos por valores reais.
 - Sistema de tarefas relacionado aos jogos para ser recompensado com moedas..