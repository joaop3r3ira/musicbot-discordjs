const { DisTube } = require('distube')
require('colors')
require ('dotenv').config()
const Discord = require('discord.js')
const client = new Discord.Client({
  intents: [
    Discord.GatewayIntentBits.Guilds,
    Discord.GatewayIntentBits.GuildMembers,
    Discord.GatewayIntentBits.GuildMessages,
    Discord.GatewayIntentBits.GuildVoiceStates,
    Discord.GatewayIntentBits.MessageContent
  ]
})
const config = require('./config/config.json')
const { SpotifyPlugin } = require('@distube/spotify')
const { SoundCloudPlugin } = require('@distube/soundcloud')
const { YtDlpPlugin } = require('@distube/yt-dlp')

client.config = require('./config/config.json')
client.distube = new DisTube(client, {
  leaveOnStop: false,
  emitNewSongOnly: true,
  emitAddSongWhenCreatingQueue: false,
  emitAddListWhenCreatingQueue: false,
  plugins: [
    new SpotifyPlugin({
      emitEventsAfterFetching: true
    }),
    new SoundCloudPlugin(),
    new YtDlpPlugin()
  ]
})
client.commands = new Discord.Collection()
client.aliases = new Discord.Collection()
client.emotes = config.emoji

function reqhandlers(){
  ["command", "events"].forEach(handler => {
    try{
      require(`./handlers/${handler}`)(client, Discord)
    } catch (e) {
      console.warn(e)
    }
  })
}

reqhandlers()

const status = queue =>
  `Volume: \`${queue.volume}%\` | Filtros: \`${queue.filters.names.join(', ') || 'Off'}\` | Loop: \`${
    queue.repeatMode ? (queue.repeatMode === 2 ? 'Fila' : 'Esta Musica') : 'Off'
  }\` | Autoplay: \`${queue.autoplay ? 'On' : 'Off'}\``
client.distube
  .on('playSong', (queue, song) =>
    queue.textChannel.send(
      `${client.emotes.play} | Musica: \`${song.name}\` - \`${song.formattedDuration}\`\n Por: ${
        song.user
      }\n${status(queue)}`
    )
  )
  .on('addSong', (queue, song) =>
    queue.textChannel.send(
      `${client.emotes.success} | Adicionada a musica ${song.name} - \`${song.formattedDuration}\` na fila por: ${song.user}`
    )
  )
  .on('addList', (queue, playlist) =>
    queue.textChannel.send(
      `${client.emotes.success} | Adicionada a playlist \`${playlist.name}\`(${
        playlist.songs.length
      } musicas) na fila\n${status(queue)}`
    )
  )
  .on('error', (channel, e) => {
    if (channel) channel.send(`${client.emotes.error} | An error encountered: ${e.toString().slice(0, 1974)}`)
    else console.error(e)
  })
  .on('empty', channel => channel.send('O canal de voz esta vazio, a sair do canal...'))
  .on('searchNoResult', (message, query) =>
    message.channel.send(`${client.emotes.error} | Nenhum resultado para \`${query}\`!`)
  )
  .on('finish', queue => queue.textChannel.send('Finished!'))

client.login(config.token).catch(() => console.log(`-[X]- THE TOKEN YOU WROTE ON CONFIG.JSON IS NOT VALID  -[X]-`.red))
