module.exports = {
  name: 'stop',
  aliases: ['disconnect', 'leave'],
  inVoiceChannel: true,
  run: async (client, interaction) => {
    const queue = client.distube.getQueue(interaction.guildId)
    if (!queue) return interaction.reply({ content: `${client.emotes.error} | There is nothing in the queue right now!`, ephemeral: true })
    queue.stop()
    interaction.reply({ content: `${client.emotes.success} | Stopped!`, ephemeral: true })
  }
}
