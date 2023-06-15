require('dotenv').config();
const { Client, Intents, MessageAttachment } = require('discord.js');
const { Configuration, OpenAIApi } = require('openai');
const context = require('./context');

const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.MESSAGE_CONTENT],
});

const configuration = new Configuration({
  organization: process.env.OPENAI_ORGANIZATION,
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// Eventos
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

const messageLengthLimit = 2000;
client.on('messageCreate', async (message) => {
  try {
    if (message.author.bot) return;
    if (message.channel.id !== process.env.CHAT_BOT_CHANNEL) return;
    if (!message.content.startsWith('!ask')) return;

    await message.channel.sendTyping();

    const input = message.content.slice(5).trim(); // Remove o prefixo "!ask" do comando

    if (input.length === 0) {
      message.reply("Por favor, forneça uma pergunta ou uma declaração para eu responder.");
      return;
    }

    if (input.length > messageLengthLimit) {
      message.reply("A entrada é muito longa. Por favor, forneça uma pergunta ou uma declaração mais curta.");
      return;
    }

    let prevMessages = await message.channel.messages.fetch({ limit: 15 });
    prevMessages = prevMessages.sort((a, b) => a - b);

    let conversationLog = [{ role: 'system', content: context }];

    prevMessages.forEach((msg) => {
      if (msg.content.startsWith('!')) return;
      if (msg.content.length > messageLengthLimit) return;
      if (msg.author.id !== client.user.id && message.author.bot) return;

      if (msg.author.id === client.user.id) {
        conversationLog.push({
          role: 'assistant',
          content: `${msg.content}`,
        });
      } else {
        if (msg.author.id !== message.author.id) return;

        conversationLog.push({
          role: 'user',
          content: `${msg.content}`,
        });
      }
    });

    const res = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: conversationLog,
    });

    let reply = res.data.choices[0].message.content;

    if (reply.length > messageLengthLimit) {
      const buffer = Buffer.from(reply, 'utf8');
      const txtFile = new MessageAttachment(buffer, `${message.author.tag}_response.txt`);

      message.reply({ files: [txtFile] }).catch(() => {
        message.channel.send({ content: `${message.author}`, files: [txtFile] });
      });
    } else {
      message.reply(reply).catch(() => {
        message.channel.send(`${message.author} ${reply}`);
      });
    }
  } catch (error) {
    console.error('Erro:', error);
    message.reply('Desculpe, ocorreu um erro ao processar a sua solicitação. Por favor, tente novamente mais tarde.');
  }
});

client.login(process.env.TOKEN);
