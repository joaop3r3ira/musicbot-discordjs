require('dotenv').config();
const { Configuration, OpenAIApi } = require('openai');
const context = require('./context');

const configuration = new Configuration({
  organization: process.env.OPENAI_ORGANIZATION,
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const msgLengthLimit = 2000;

async function processMessage(message) {
  try {
    if (message.author.bot) return;
    if (message.content.length > msgLengthLimit) {
      message.reply("Whoa now, I'm not going to read all that. Maybe summarize?");
      return;
    }

    let prevMessages = await message.channel.messages.fetch({ limit: 15 });
    prevMessages = prevMessages.sort((a, b) => a - b);

    let conversationLog = [{ role: 'system', content: context }];

    prevMessages.forEach((msg) => {
      if (msg.content.startsWith('!')) return;
      if (msg.content.length > msgLengthLimit) return;
      if (msg.author.id !== message.author.id) return;

      if (msg.author.id === message.client.user.id) {
        conversationLog.push({
          role: 'assistant',
          content: `${msg.content}`,
        });
      } else {
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

    let reply = res.data.choices[0].message?.content;

    if (reply?.length > 2000) {
      message.reply('A resposta é muito longa para ser exibida. Enviei um arquivo de texto em vez disso.');
      const buffer = Buffer.from(reply, 'utf8');
      const txtFile = new Discord.MessageAttachment(buffer, `${message.author.tag}_response.txt`);
      message.channel.send(txtFile);
    } else {
      message.reply(reply);
    }
  } catch (error) {
    message.reply('Algo deu errado. Tente novamente mais tarde.');
    console.log(`Error: ${error}`);
  }
}

// Exemplo de uso com !ask
client.on('messageCreate', (message) => {
  if (message.content.startsWith('!ask')) {
    processMessage(message);
  }
});

client.login(process.env.TOKEN);
