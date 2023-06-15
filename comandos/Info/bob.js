module.exports = {
    name: "bob",
    aliases: ["Bob", "BOB"],
    desc: "Server para ver o ping do bot",
    run: async (client, message, args, prefix) => {
        message.reply(`Marley! O bot está com \`${client.ws.ping}ms\` de ping`)
    }
}