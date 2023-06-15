const { EmbedBuilder } = require('discord.js');
const { playSongEmbed, addListEmbed } = require('../../handlers/embed'); 

module.exports = {
  name: 'play',
  aliases: ['tocar', 'musica', 'p', 'm'],
  inVoiceChannel: true,
  run: async (client, message, args) => {
    registerDistubeEvents(client.distube, EmbedBuilder, client);

    const string = args.join(' ');
    if (!string) {
      return message.channel.send(`${client.emotes.error} | Please enter a song url or query to search.`);
    }

    try {
      await client.distube.play(message.member.voice.channel, string, {
        member: message.member,
        textChannel: message.channel,
        message,
      });
    } catch (error) {
      console.error(error);
      message.channel.send(`${client.emotes.error} | An error encountered: ${error.toString().slice(0, 1974)}`);
    }
  },
};

function registerDistubeEvents(distube, EmbedBuilder, client) {
  distube.removeAllListeners();
  distube
    .on('playSong', (queue, song) => {
      const embed = playSongEmbed(song, EmbedBuilder, client);
      queue.textChannel.send({ embeds: [embed] });
    })
    .on('addSong', (queue, song) =>
      queue.textChannel.send(
        `${client.emotes.success} | Adicionada a musica ${song.name} - \`${song.formattedDuration}\` na fila por: ${song.user}`
      )
    )
    .on('addList', (queue, playlist, song) => {
      const embed = addListEmbed(queue, playlist, song, client,  EmbedBuilder);
      queue.textChannel.send({ embeds: [embed] });
    })    
    .on('error', (channel, e) => {
      if (channel) channel.send(`${client.emotes.error} | An error encountered: ${e.toString().slice(0, 1974)}`);
      else console.error(e);
    })
    .on('empty', (channel) => channel.send('O canal de voz esta vazio, a sair do canal...'))
    .on('searchNoResult', (message, query) =>
      message.channel.send(`${client.emotes.error} | Nenhum resultado para \`${query}\`!`)
    )
    .on('finish', (queue) => queue.textChannel.send('Finished!'));
}




