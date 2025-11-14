const { Telegraf } = require('telegraf');
const { OpenAI } = require('openai');

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

module.exports = async (req, res) => {
  if (req.method === 'POST') {
    try {
      const { message } = req.body;
      
      // Send to OpenAI
      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            
content: "You are a PUE methodology AI teacher. Teach Prompt → Understand → Execute → Reflect in Bahasa Malaysia."
          },
          {
            role: "user",
            content: message.text
          }
        ]
      });

      // Send reply back to Telegram
      await bot.telegram.sendMessage(
        message.chat.id, 
        completion.choices[0].message.content
      );

      res.status(200).json({ ok: true });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(404).json({ error: 'Not found' });
  }
};
