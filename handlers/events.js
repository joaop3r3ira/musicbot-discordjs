const fs = require('fs');
const allevents = [];
module.exports = async (client) => {
    try {
        try {
            console.log("A carregar os eventos...".yellow)
        } catch {}
        let quantidade = 0;
        const carregar_dir = (dir) => {
            const arquivos_eventos = fs.readdirSync(`./eventos/${dir}`).filter((file) => file.endsWith('.js'));
            for(const arquivo of arquivos_eventos){
                try {
                    const evento = require(`../eventos/${dir}/${arquivo}`);
                    const nome_evento = arquivo.split(".")[0];
                    allevents.push(nome_evento);
                    client.on(nome_evento, evento.bind(null, client));
                    quantidade++
                } catch(e){
                    console.log(e)
                }
            }
        }
        await ["client", "guild"].forEach(e => carregar_dir(e));
        console.log(`${quantidade} Eventos carregados com sucesso`.brightGreen);
        try {console.log(`A iniciar o bot...`.yellow)} catch(e) {console.log(e)}
    } catch (e){
        console.log(e.bgRed)
    }
}   