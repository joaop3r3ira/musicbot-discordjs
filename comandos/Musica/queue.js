const { ButtonBuilder, ActionRowBuilder, EmbedBuilder, ButtonStyle } = require('discord.js');

module.exports = {
  name: 'queue',
  aliases: ['q'],
  run: async (client, message) => {
    const queue = client.distube.getQueue(message);
    if (!queue) return message.channel.send(`${client.emotes.error} | There is nothing playing!`);
    const songsPerPage = 10;
    const pageLimit = Math.ceil(queue.songs.length / songsPerPage);
    let currentPage = 1;

    let songs = queue.songs.slice((currentPage - 1) * songsPerPage, currentPage * songsPerPage);
    const embed = new EmbedBuilder()
      .setColor('#0099ff')
      .setTitle('Server Queue');

    const nowPlaying = queue.songs[0];
    let description = `Now playing: [${nowPlaying.name}](${nowPlaying.url}) - \`${nowPlaying.formattedDuration}\`\n\n`;

    if (songs.length > 1) {
      songs.slice(1).forEach((song, i) => {
        description += `${(currentPage - 1) * songsPerPage + i + 1}: [${song.name}](${song.url}) - \`${song.formattedDuration}\`\n`;
      });
    }

    embed.setDescription(description);

    const buttonsRow = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setCustomId('previous')
          .setLabel('Previous')
          .setStyle(ButtonStyle.Primary)
          .setDisabled(true),
        new ButtonBuilder()
          .setCustomId('next')
          .setLabel('Next')
          .setStyle(ButtonStyle.Primary)
          .setDisabled(pageLimit === 1),
      );

    const messageEmbed = await message.channel.send({ embeds: [embed], components: [buttonsRow] });

    const filter = (interaction) => interaction.user.id === message.author.id;
    const collector = messageEmbed.createMessageComponentCollector({ filter, time: 60000 });

    collector.on('collect', async (interaction) => {
      if (interaction.customId === 'previous') {
        currentPage--;

        if (currentPage < 1) {
          currentPage = 1;
        } else {
          songs = queue.songs.slice((currentPage - 1) * songsPerPage, currentPage * songsPerPage);

          let description = `Now playing: [${nowPlaying.name}](${nowPlaying.url}) - \`${nowPlaying.formattedDuration}\`\n\n`;

          if (songs.length > 1) {
            songs.slice(1).forEach((song, i) => {
              description += `${(currentPage - 1) * songsPerPage + i + 1}: [${song.name}](${song.url}) - \`${song.formattedDuration}\`\n`;
            });
          }

          embed.setDescription(description);

          buttonsRow.components[0].setDisabled(currentPage === 1);
          buttonsRow.components[1].setDisabled(currentPage === pageLimit);
          await interaction.update({ embeds: [embed], components: [buttonsRow] });
        }

      } else if (interaction.customId === 'next') {
        currentPage++;
        songs = queue.songs.slice((currentPage - 1) * songsPerPage, currentPage * songsPerPage);

        let description = `Now playing: [${nowPlaying.name}](${nowPlaying.url}) - \`${nowPlaying.formattedDuration}\`\n\n`;

        if (songs.length > 1) {
          songs.forEach((song, i) => {
            description += `${(currentPage - 1) * songsPerPage + i + 1}: [${song.name}](${song.url}) - \`${song.formattedDuration}\`\n`;
          });
        }

        embed.setDescription(description);

        buttonsRow.components[0].setDisabled(currentPage === 1);
        buttonsRow.components[1].setDisabled(currentPage === pageLimit);
        await interaction.update({ embeds: [embed], components: [buttonsRow] });

      } else if (interaction.customId.startsWith('song_')) {
        const songIndex = parseInt(interaction.customId.split('_')[1]);
        if (songIndex > 0 && songIndex < queue.songs.length) {
          client.distube.skipTo(message, songIndex);
          interaction.reply({ content: `Skipped to song: [${queue.songs[songIndex].name}](${queue.songs[songIndex].url})`, ephemeral: true });
        }
      }
    });

    collector.on('end', async () => {
      buttonsRow.components.forEach((c) => c.setDisabled(true));
      await messageEmbed.edit({ components: [buttonsRow] });
    });
  }
};

