const { Configuration, OpenAIApi } = require('openai');
const context = require('../../context');

const configuration = new Configuration({
  organization: process.env.OPENAI_ORGANIZATION,
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

module.exports = {
  name: 'ask',
  aliases: ['perguntar'],
  run: async (client, message, args) => {
    try {
      const question = args.join(' ');
      if (!question) {
        return message.channel.send('Por favor, forneça uma pergunta para que eu possa responder.');
      }

      const conversationLog = [
        { role: 'system', content: context },
        { role: 'user', content: question },
      ];

      const res = await openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: conversationLog,
      });

      const reply = res.data.choices[0].message?.content;
      message.channel.send(reply);
    } catch (error) {
      console.error(error);
      message.channel.send('Desculpe, algo deu errado ao processar sua pergunta. Por favor, tente novamente mais tarde.');
    }
  },
};
