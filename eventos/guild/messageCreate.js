const config = require(`${process.cwd()}/config/config.json`)
const serverSchema =  require(`${process.cwd()}/schemas/servidor.js`)
const {protect_all} = require(`${process.cwd()}/handlers/functions.js`)
module.exports = async (client, message) => {
    if(!message.guild || !message.channel || message.author.bot) return;
    await protect_all(message.guild.id, message.author.id);
    let data = await serverSchema.findOne({guildID: message.guild.id})
    if(!message.content.startsWith(data.prefixo)) return;
    const args = message.content.slice(data.prefixo.length).trim().split(" ");
    const cmd = args.shift()?.toLowerCase();
    const command = client.commands.get(cmd) || client.commands.find(c => c.aliases && c.aliases.includes(cmd));
    if(command) {
        command.run(client, message, args, data.prefixo)
    } else {
    return message.reply("❌ Não foi encontrado o comando!");
    }

}
