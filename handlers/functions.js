const serverSchema = require(`${process.cwd()}/schemas/servidor.js`);
const Discord = require('discord.js')
const config = require(`${process.cwd()}/config/config.json`);

module.exports = {
    protect_all,
}

async function protect_all(guildid, userid) {
    if (guildid) {
        let serverdata = await serverSchema.findOne({ guildID: guildid })
        if (!serverdata) {
            console.log(`MONGODB: Config de Server carregado`.green);
            serverdata = await new serverSchema({
                guildID: guildid,
                prefixo: config.prefix
            });
            await serverdata.save();
        }
    }
}

