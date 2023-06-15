const mongoose = require('mongoose');
const config = require('../../config/config.json');

module.exports = async (client) => {
  let stick = 53;

  try {
    await mongoose.connect(config.mongodb, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`
╔═════════════════════════════════════════════════════╗
║                                                     ║
║         ║     MONGODB CONNECTADA!  ║                ║
║                                                     ║
╚═════════════════════════════════════════════════════╝`.blue)
  } catch (err) {
    console.log(`☁ ERRO AO CONECTAR NA BASE DE DADOS DE MONGODB`.red);
    console.log(err)
  }

  console.log(`╔═════════════════════════════════════════════════════╗`.green)
  console.log(`║ `.green + " ".repeat(-1 + stick - 1) + " ║".green)
  console.log(`║ `.green + `      Conectado como ${client.user.tag}`.green + " ".repeat(-1 + stick - 1 - `      Conectado como ${client.user.tag}`.length) + " ║".green)
  console.log(`║ `.green + " ".repeat(-1 + stick - 1) + " ║".green)
  console.log(`╚═════════════════════════════════════════════════════╝`.green)

  client.once('ready', async () => {
    console.log(`Bot iniciado como ${client.user.tag}!`);
    const guildPrefix = await client.db.get(`prefix-${message.guild.id}`);
    console.log(`Prefixo atual do servidor: ${guildPrefix}`);
  });
}
