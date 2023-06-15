module.exports.playSongEmbed = function (song) {
  const embed = {
      color: parseInt('8E44AD', 16),
      title: song.name,
      url: song.url,
      description: `Duração: \`${song.duration}\``,
      thumbnail: {
          url: song.thumbnail
      },
      timestamp: new Date().toISOString()
  };
  return embed;
}

module.exports.addListEmbed = function (queue, playlist) {
  if (!playlist) return;
  const embed = {
      color: parseInt('8E44AD', 16),
      title: `Adicionada a playlist \`${playlist.name}\` (${playlist.songs.length} músicas) na fila`,
      description: `A playlist ${playlist.name} foi adicionada com sucesso!`,
      timestamp: new Date().toISOString()
  };
  return embed;
}
