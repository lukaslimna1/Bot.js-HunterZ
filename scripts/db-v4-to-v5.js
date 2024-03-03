// Configuração do ambiente e conexão com o MongoDB
require("dotenv").config();
const mongoose = require("mongoose");

// Interface de leitura para interação com o usuário
const readline = require("readline");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Mensagem de aviso
const warningMsg = `---------------
!!! AVISO !!!
---------------
Este script migrará seu banco de dados da versão v4 para v5. Este script ainda está em desenvolvimento e é irreversível.
Certifique-se de ter um backup do seu banco de dados antes de continuar.
Deseja continuar? (s/n): `;

// Pergunta ao usuário se deseja continuar
rl.question(warningMsg, async function (name) {
  try {
    if (name.toLowerCase() === "s") {
      console.log("🚀 Iniciando migração (v4 para v5)");
      await migration();
      console.log("⚡ Migração concluída");
      process.exit(0);
    } else {
      console.log("Migração cancelada");
      process.exit(0);
    }
  } catch (ex) {
    console.log(ex);
    process.exit(1);
  }
});

// Função principal de migração
async function migration() {
  // Conectar ao banco de dados
  await mongoose.connect(process.env.MONGO_CONNECTION, { keepAlive: true });
  console.log("🔌 Conexão com o banco de dados estabelecida");

  // Obter todas as coleções
  const collections = await mongoose.connection.db.collections();
  console.log(`🔎 Encontradas ${collections.length} coleções`);

  // Chamar funções de migração para cada coleção
  await migrateGuilds(collections);
  await migrateModLogs(collections);
  await migrateTranslateLogs(collections);
  await migrateSuggestions(collections);
  await migrateMemberStats(collections);
  await migrateMembers(collections);
  await migrateUsers(collections);
  await migrateMessages(collections);
}

// Função para limpar a linha de comando e exibir uma mensagem
const clearAndLog = (message) => {
  process.stdout.clearLine();
  process.stdout.cursorTo(0);
  console.log(message);
};

/**
 * Migrar a coleção 'guilds' da v4 para v5
 * @param {mongoose.Collection<mongoose.Document>[]} collections
 */
const migrateGuilds = async (collections) => {
  process.stdout.write("📦 Migrando a coleção 'guilds' ");
  try {
    const guildsC = collections.find((c) => c.collectionName === "guilds");
    const toUpdate = await guildsC
      .find({
        $or: [
          { "data.owner": { $type: "object" } },
          { "automod.strikes": 5 },
          { "automod.action": "MUTE" },
          { "automod.anti_scam": { $exists: true } },
          { "max_warn.strikes": 5 },
          { ranking: { $exists: true } },
        ],
      })
      .toArray();

    if (toUpdate.length > 0) {
      for (const doc of toUpdate) {
        if (typeof doc.data.owner === "object") doc.data.owner = doc.data.owner.id;
        if (typeof doc.automod === "object") {
          if (doc.automod.strikes === 5) doc.automod.strikes = 10;
          if (doc.automod.action === "MUTE") doc.automod.action = "TIMEOUT";
          doc.automod.anti_spam = doc.automod.anti_scam || false;
        }
        if (typeof doc.max_warn === "object") {
          if (doc.max_warn.action === "MUTE") doc.automod.action = "TIMEOUT";
          if (doc.max_warn.action === "BAN") doc.automod.action = "KICK";
        }
        if (typeof doc.stats !== "object") doc.stats = {};
        if (doc.ranking?.enabled) doc.stats.enabled = true;
        await guildsC.updateOne({ _id: doc._id }, { $set: doc });

        process.stdout.clearLine();
        process.stdout.cursorTo(0);
        process.stdout.write(
          `📦 Migrando a coleção 'guilds' | Concluído - ${Math.round(
            (toUpdate.indexOf(doc) / toUpdate.length) * 100
          )}%`
        );
      }

      await guildsC.updateMany(
        {},
        {
          $unset: {
            "automod.anti_scam": "",
            "automod.max_mentions": "",
            "automod.max_role_mentions": "",
            ranking: "",
          },
        }
      );

      clearAndLog(`📦 Migrando a coleção 'guilds' | ✅ Atualizado: ${toUpdate.length}`);
    } else {
      clearAndLog("📦 Migrando a coleção 'guilds' | ✅ Sem atualizações necessárias");
    }
  } catch (ex) {
    clearAndLog("📦 Migrando a coleção 'guilds' | ❌ Ocorreu um erro");
    console.log(ex);
  }
};

/**
 * Migrar a coleção 'mod-logs' da v4 para v5
 * @param {mongoose.Collection<mongoose.Document>[]} collections
 */
const migrateModLogs = async (collections) => {
  process.stdout.write("📦 Migrando a coleção 'mod-logs' ");
  try {
    const modLogs = collections.find((c) => c.collectionName === "mod-logs");
    const stats = await modLogs.updateMany({}, { $unset: { expires: "" } });
    await modLogs.updateMany({ type: "MUTE" }, { $set: { type: "TIMEOUT" } });
    await modLogs.updateMany({ type: "UNMUTE" }, { $set: { type: "UNTIMEOUT" } });
    console.log(`| ✅ ${stats.modifiedCount > 0 ? `Atualizado: ${stats.modifiedCount}` : "Sem atualizações necessárias"}`);
  } catch (ex) {
    clearAndLog("📦 Migrando a coleção 'mod-logs' | ❌ Ocorreu um erro");
    console.log(ex);
  }
};

/**
 * Migrar a coleção 'translate-logs' da v4 para v5
 * @param {mongoose.Collection<mongoose.Document>[]} collections
 */
const migrateTranslateLogs = async (collections) => {
  process.stdout.write("📦 Migrando a coleção 'translate-logs' ");
  console.log("| ✅ Sem atualizações necessárias");
};

/**
 * Migrar a coleção 'suggestions' da v4 para v5
 * @param {mongoose.Collection<mongoose.Document>[]} collections
 */
const migrateSuggestions = async (collections) => {
  process.stdout.write("📦 Migrando a coleção 'suggestions' ");
  try {
    const suggestionsC = collections.find((c) => c.collectionName === "suggestions");

    const toUpdate = await suggestionsC
      .find({ $or: [{ channel_id: { $exists: false } }, { createdAt: { $exists: true } }] })
      .toArray();

    if (toUpdate.length > 0) {
      // Cache de todas as guildas
      const guilds = await collections
        .find((c) => c.collectionName === "guilds")
        .find({})
        .toArray();
      const cache = new Map();
      for (const guild of guilds) cache.set(guild._id, guild);

      for (const doc of toUpdate) {
        const guildDb = cache.get(doc.guild_id);
        await suggestionsC.updateOne(
          { _id: doc._id },
          {
            $set: { channel_id: guildDb.suggestions.channel_id },
            $rename: { createdAt: "created_at", updatedAt: "updated_at" },
          }
        );
        process.stdout.clearLine();
        process.stdout.cursorTo(0);
        process.stdout.write(
          `📦 Migrando a coleção 'suggestions' | Concluído - ${Math.round(
            (toUpdate.indexOf(doc) / toUpdate.length) * 100
          )}%`
        );
      }

      clearAndLog(`📦 Migrando a coleção 'suggestions' | ✅ Atualizado: ${toUpdate.length}`);
    } else {
      clearAndLog("📦 Migrando a coleção 'suggestions' | ✅ Sem atualizações necessárias");
    }
  } catch (ex) {
    clearAndLog("📦 Migrando a coleção 'suggestions' | ❌ Ocorreu um erro");
    console.log(ex);
  }
};

/**
 * Migrar a coleção 'member-stats' da v4 para v5
 * @param {mongoose.Collection<mongoose.Document>[]} collections
 */
const migrateMemberStats = async (collections) => {
  process.stdout.write("📦 Migrando a coleção 'member-stats' ");
  try {
    const membersC = collections.find((c) => c.collectionName === "members");
    if (!collections.find((c) => c.collectionName === "member-stats")) {
      const memberStatsC = await mongoose.connection.db.createCollection("member-stats");

      const toUpdate = await membersC
        .find({ $or: [{ xp: { $exists: true } }, { level: { $exists: true } }] })
        .toArray();
      if (toUpdate.length > 0) {
        for (const doc of toUpdate) {
          await memberStatsC.insertOne({
            guild_id: doc.guild_id,
            member_id: doc.member_id,
            xp: doc.xp,
            level: doc.level,
          });
          process.stdout.clearLine();
          process.stdout.cursorTo(0);
          process.stdout.write(
            `📦 Migrando a coleção 'member-stats' | Concluído - ${Math.round(
              (toUpdate.indexOf(doc) / toUpdate.length) * 100
            )}%`
          );
        }

        clearAndLog(`📦 Migrando a coleção 'member-stats' | ✅ Atualizado: ${toUpdate.length}`);
      } else {
        clearAndLog("📦 Migrando a coleção 'member-stats' | ✅ Sem atualizações necessárias");
      }
    } else {
      clearAndLog("📦 Migrando a coleção 'member-stats' | ✅ Sem atualizações necessárias");
    }
  } catch (ex) {
    clearAndLog("📦 Migrando a coleção 'member-stats' | ❌ Ocorreu um erro");
    console.log(ex);
  }
};

/**
 * Migrar a coleção 'members' da v4 para v5
 * @param {mongoose.Collection<mongoose.Document>[]} collections
 */
const migrateMembers = async (collections) => {
  process.stdout.write("📦 Migrando a coleção 'members' ");
  try {
    const membersC = collections.find((c) => c.collectionName === "members");
    const toUpdate = await membersC.find({ $or: [{ xp: { $exists: true } }, { level: { $exists: true } }] }).toArray();
    if (toUpdate.length > 0) {
      const stats = await membersC.updateMany({}, { $unset: { xp: "", level: "", mute: "" } });
      clearAndLog(`📦 Migrando a coleção 'members' | ✅ Atualizado: ${stats.modifiedCount}`);
    } else {
      clearAndLog("📦 Migrando a coleção 'members' | ✅ Sem atualizações necessárias");
    }
  } catch (ex) {
    clearAndLog("📦 Migrando a coleção 'members' | ❌ Ocorreu um erro");
    console.log(ex);
  }
};

/**
 * Migrar a coleção 'users' da v4 para v5
 * @param {mongoose.Collection<mongoose.Document>[]} collections
 */
const migrateUsers = async (collections) => {
  process.stdout.write("📦 Migrando a coleção 'users' ...");
  try {
    const usersC = collections.find((c) => c.collectionName === "users");

    const toUpdate = await usersC
      .find({ $or: [{ username: { $exists: false } }, { discriminator: { $exists: false } }] })
      .toArray();

    if (toUpdate.length > 0) {
      const { Client, GatewayIntentBits } = require("discord.js");
      const client = new Client({ intents: [GatewayIntentBits.Guilds] });
      await client.login(process.env.BOT_TOKEN);

      let success = 0,
        failed = 0;

      for (const doc of toUpdate) {
        try {
          const user = await client.users.fetch(doc._id);
          await usersC.updateOne(
            { _id: doc._id },
            { $set: { username: user.username, discriminator: user.discriminator } }
          );
          success++;
        } catch (e) {
          failed++;
        }

        process.stdout.clearLine();
        process.stdout.cursorTo(0);
        process.stdout.write(
          `📦 Migrando a coleção 'users' | Concluído - ${Math.round(
            (toUpdate.indexOf(doc) / toUpdate.length) * 100
          )}%`
        );
      }

      clearAndLog(`📦 Migrando a coleção 'users' | ✅ Atualizado: ${success} | ❌ Falha: ${failed}`);
    } else {
      clearAndLog("📦 Migrando a coleção 'users' | ✅ Sem atualizações necessárias");
    }
  } catch (ex) {
    clearAndLog("📦 Migrando a coleção 'users' | ❌ Ocorreu um erro");
    console.log(ex);
  }
};

/**
 * Migrar a coleção 'messages' da v4 para v5
 * @param {mongoose.Collection<mongoose.Document>[]} collections
 */
const migrateMessages = async (collections) => {
  process.stdout.write("📦 Migrando a coleção 'messages' ");
  try {
    if (
      !collections.find((c) => c.collectionName === "v4-ticket-backup") &&
      !collections.find((c) => c.collectionName === "reaction-roles") &&
      collections.find((c) => c.collectionName === "messages")
    ) {
      const rrolesC = await mongoose.connection.db.createCollection("reaction-roles");
      const ticketsC = await mongoose.connection.db.createCollection("v4-ticket-backup");
      const messagesC = collections.find((c) => c.collectionName === "messages");

      const rrToUpdate = await messagesC.find({ roles: { $exists: true, $ne: [] } }).toArray();
      const tToUpdate = await messagesC.find({ ticket: { $exists: true } }).toArray();

      if (rrToUpdate.length > 0 || tToUpdate.length > 0) {
        await rrolesC.insertMany(
          rrToUpdate.map((doc) => ({
            guild_id: doc.guild_id,
            channel_id: doc.channel_id,
            message_id: doc.message_id,
            roles: doc.roles,
          }))
        );

        await ticketsC.insertMany(
          tToUpdate.map((doc) => ({
            guild_id: doc.guild_id,
            channel_id: doc.channel_id,
            message_id: doc.message_id,
            ticket: doc.ticket,
          }))
        );

        await mongoose.connection.db.dropCollection("messages");

        clearAndLog(
          `📦 Migrando a coleção 'messages' | Concluído - Atualizado: ${rrToUpdate.length + tToUpdate.length}`
        );
      } else {
        await mongoose.connection.db.dropCollection("messages");
        clearAndLog("📦 Migrando a coleção 'messages' | ✅ Sem atualizações necessárias");
      }
    } else {
      clearAndLog("📦 Migrando a coleção 'messages' | ✅ Sem atualizações necessárias");
    }
  } catch (ex) {
    clearAndLog("📦 Migrando a coleção 'messages' | ❌ Ocorreu um erro");
    console.log(ex);
  }
};
