# ⚙ Admin

~~~Importante
Estes comandos só podem ser usados por membros que têm permissão **MANAGE_SERVER**
~~~

### Definir Prefixo

- **Descrição**: Define o prefixo do bot
- **Uso**: `!setprefix <novoPrefixo>`

### Embed

- **Descrição**: Envia uma mensagem incorporada (embed)
- **Uso**: `!embed <#canal>`

### Automoderação

~~~Importante
Por padrão, os eventos de automoderação são ignorados para membros que têm as seguintes permissões, pois é assumido que eles são moderadores do canal/servidor:

**KICK_MEMBERS**, **BAN_MEMBERS**, **MANAGE_GUILD**, **MANAGE_MESSAGES**

`!automodconfig debug on` desativa isso
~~~

|                                                 |                                                                |
| ----------------------------------------------- | -------------------------------------------------------------- |
| **!automodconfig status**                       | visualiza o status da configuração                               |
| **!automodconfig strikes \<quantidade>**        | define o número máximo de strikes antes de tomar uma ação        |
| **!automodconfig action \<timeout\|mute\|ban>** | define a ação a ser realizada após atingir o número máximo de strikes |
| **!automodconfig debug \<on\|off>**             | ativa a automod para mensagens enviadas por admins e moderadores  |
| **!automodconfig whitelist**                    | lista de canais que estão na lista branca                         |
| **!automodconfig whitelistadd \<canal>**       | adiciona um canal à lista branca                                  |
| **!automodconfig whitelistremove \<canal>**    | remove um canal da lista branca                                   |

**Configurações**

| Nome                                          | Descrição                                                                 |
| --------------------------------------------- | --------------------------------------------------------------------------- |
| **!anti ghostping \<on\|off>**                | registra menções fantasmas em seu servidor (Requer a configuração de um canal `/modlog`) |
| **!anti spam \<on\|off>**                     | ativa ou desativa a detecção de antispam                                    |
| **!anti massmention \<on\|off> \[limiar]**    | ativa ou desativa a detecção de menções em massa (limiar padrão é 3 menções) |
|

**Autodelete**

| Nome                                   | Descrição                                                                 |
| -------------------------------------- | --------------------------------------------------------------------------- |
| **!autodelete attachments \<on\|off>** | registra menções fantasmas em seu servidor (Requer a configuração de um canal `/modlog`) |
| **!autodelete invites \<on\|off>**     | permite ou proíbe o envio de convites do Discord na mensagem                |
| **!automod links \<on\|off>**          | permite ou proíbe o envio de links na mensagem                              |
| **!automod maxlines \<quantidade>**    | define o número máximo de linhas permitidas por mensagem                   |

~~~Importante
Cada vez que um membro tenta quebrar a regra automatizada, ele/a **recebe um strike**. Após receber o número máximo de strikes (padrão 10), a ação de moderação (padrão TIMEOUT) é realizada neles.
~~~


### Contadores de Canais

- **Descrição:** Configurar um canal contador no servidor
- **Uso**: `!counter <tipo_contador> <nome>`
- **Tipos de contadores disponíveis:**
  - USUÁRIOS: conta o número total de membros no servidor (membros + bots)
  - MEMBROS: conta o número total de membros
  - BOTS: conta o número total de bots

### Advertências

- **!maxwarn limit \<quantidade>**: define o número máximo de advertências que um membro pode receber antes de tomar uma ação
- **!maxwarn action \<timeout\|kick\|ban>**: define a ação a ser realizada após atingir o número máximo de advertências

### Registro de Moderação

- **Descrição:** Ativar ou desativar logs de moderação
- **Uso**: `!modlog <canal|off>`

{% hint style="info" %}
A ativação do registro de moderação registra todas as **ações de moderação** e **eventos de automoderação**
{% endhint %}

### Tradução de Bandeiras

_Habilitar esse recurso permite que os membros simplesmente reajam a qualquer mensagem com um emoji de bandeira de país, traduzindo o conteúdo da mensagem para o idioma regional_

- **Descrição:** Configurar a tradução de bandeiras no servidor
- **Uso**: `!flagtr <on|off>`

![](../.gitbook/assets/image.png)

### Auto Role

- **Descrição:** Configurar a função a ser concedida quando um membro entra no servidor
- **Uso**: `!autorole <função|off>`

### Saudações

{% tabs %}
{% tab title="Boas-vindas" %}
**!welcome status \<on\|off>**

- ativar ou desativar mensagem de boas-vindas

**!welcome channel \<#canal>**

- configurar o canal onde as mensagens de boas-vindas devem ser enviadas

**!welcome preview**

- enviar uma prévia de boas-vindas

**!welcome desc \<conteúdo>**

- definir a descrição incorporada de boas-vindas

**!welcome footer \<conteúdo>**

- definir o rodapé incorporado de boas-vindas

**!welcome thumbnail \<on\|off>**

- ativar ou desativar miniatura da mensagem de boas-vindas

**!welcome color \<#hex>**

- definir a cor incorporada de boas-vindas

**!welcome image \<URL-da-imagem>**

- definir a imagem incorporada de boas-vindas
  {% endtab %}

{% tab title="Adeus" %}
**!farewell status \<on\|off>**

- ativar ou desativar mensagem de despedida

**!farewell channel \<#canal>**

- configurar o canal onde as mensagens de despedida devem ser enviadas

**!farewell preview**

- enviar uma prévia de despedida

**!farewell desc \<conteúdo>**

- definir a descrição incorporada de despedida

**!farewell footer \<conteúdo>**

- definir o rodapé incorporado de despedida

**!farewell thumbnail \<on\|off>**

- ativar ou desativar miniatura da mensagem de despedida

**!farewell color \<#hex>**

- definir a cor incorporada de despedida

**!farewell image \<URL-da-imagem>**

- definir a imagem incorporada de despedida
  {% endtab %}
  {% endtabs %}

{% hint style="success" %}


#### Allowed Content Replacements

- \n : New Line&#x20;
- {server} : Server Name&#x20;
- {count} : Server member count&#x20;
- {member:nick} : Member Nickname&#x20;
- {member:name} : Member Name&#x20;
- {member:dis} : Member Discriminator&#x20;
- {member:tag} : Member Tag&#x20;
- {member:mention} : Member Mention&#x20;
- {member:avatar} : Member Avatar URL&#x20;
- {inviter:name} : Inviter Name&#x20;
- {inviter:tag} : Inviter Tag&#x20;
- {invites} : Inviter Invites
  {% endhint %}

### Reaction Roles

**Create Reaction Role**

- **Usage**: `!addrr <#channel> <messageId> <role> <emote>`
- **Description**: setup reaction role for the specified message

**Remove Reaction Roles**

- **Usage**: `!removerr <#channel> <messageId>`
- **Description**: remove configured reaction for the specified message

### Ticketing

**Configuration**

- **!ticket setup \<#channel>**: setup a new ticket message
- **!ticket log \<#channel>**: setup log channel for tickets
- **!ticket limit \<amount>**: set maximum number of concurrent open tickets
- **!ticket closeall**: close all open tickets

**Ticket Channel Commands**

- **!ticket close**: close the ticket
- **!ticket add \<userId\|roleId>**: add user/role to the ticket
- **!ticket remove \<userId\|roleId>**: remove user/role from the ticket

**Ticket Category Commands**

- **!ticketcat list**: list all ticket categories
- **!ticketcat add \<category> \| \<name>**: create a new ticket category
- **!ticketcat remove \<category>**: remove a ticket category
