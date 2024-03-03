#Imagem base
FROM node:18-alpine

# Defina o diretório de trabalho no contêiner
WORKDIR /usr/src/app

# Copie package.json e package-lock.json para o contêiner
COPY package*.json ./

#Instala apenas dependências de produção
RUN npm ci --omit=dev

# Agrupa o resto do código fonte
COPY . .

# Variáveis ​​ambientais
ENV BOT_TOKEN=
ENV MONGO_CONNECTION=
ENV ERROR_LOGS=
ENV JOIN_LEAVE_LOGS=
ENV BOT_SECRET=
ENV SESSION_PASSWORD=
ENV WEATHERSTACK_KEY=
ENV STRANGE_API_KEY=
ENV SPOTIFY_CLIENT_ID=
ENV SPOTIFY_CLIENT_SECRET=

#Expõe a porta 8080 para o painel
EXPOSE 8080

# Defina o comando para executar sua aplicação Node.js
CMD [ "node", "bot.js" ]
