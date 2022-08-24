module.exports = {
    name: "ping",
    aliases: ["Ping", "ms"],
    desc: "Server para ver o ping do bot",
    run: async (client, message, args, prefix) => {
        message.reply(`Pong! O ping do bot é \`${client.ws.ping}ms\``)
    }
}