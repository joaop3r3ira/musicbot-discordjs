const fs = require('fs');
module.exports = (client) => {
    try {
        console.log(`
╔═════════════════════════════════════════════════════╗
║                                                     ║
║     MUSICBOT V1.0 /-/ por joaop3r3ira#9236 /-/      ║
║                                                     ║
╚═════════════════════════════════════════════════════╝`.yellow)
        let comandos = 0;
        fs.readdirSync("./comandos/").forEach((pasta) => {
            const commands = fs.readdirSync(`./comandos/${pasta}`).filter((arquivo) => arquivo.endsWith(".js"));
            for (let arquivo of commands){
                let comando = require(`../comandos/${pasta}/${arquivo}`);
                if(comando.name) {
                    client.commands.set(comando.name, comando);
                    comandos++
                } else {
                    console.log(`COMANDO [/${pasta}/${arquivo}]`, `erro => O comando não está configurado`.brightRed)
                    continue;
                }
                if(comando.aliases && Array.isArray(comando.aliases)) comando.aliases.forEach((alias) => client.aliases.set(alias, comando.name));
            }
        });
        console.log(`${comandos} comandos carregados`.brightGreen);
    } catch(e){
        console.log(e)
    }
}