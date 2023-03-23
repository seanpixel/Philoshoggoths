const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { Configuration, OpenAIApi } = require("openai");

const app = express();
app.use(cors());
app.use(bodyParser.json());

function startConvo(start_prompt, name1, name2) {
    let start = `${name1}: Hey ${name2}, ${start_prompt}`;
    return start;
}

async function generateResponse(conversation, responder) {
    conversation = `${conversation}\n\n${responder}: `;
    let reply = generate(conversation);

    return reply;
}

async function generate(prompt) {
    const configuration = new Configuration({
        apiKey: process.env.OPENAI_API_KEY,
      });
      const openai = new OpenAIApi(configuration);
      
      const completion = await openai.createChatCompletion({
        model: "gpt-4",
        messages: [{role:"system", content:"You are a philosopher who likes to discuss and debate. You are currently discussing a philosophical topic with a peer. Reply to the conversation with thoughtful remarks and responses and don't be afraid to ask questions."},{role: "user", content: prompt}],
      });
      return completion.data.choices[0].message;
}

app.post('/api/start-conversation', async (req, res) => {
  const { start_prompt, name1, name2 } = req.body;
  const response = startConvo(start_prompt, name1, name2);
  res.json({ conversation: response });
});

app.post('/api/generate-response', async (req, res) => {
  const { conversation, responder } = req.body;
  const reply = await generateResponse(conversation, responder);
  const content = reply.content;
  res.json({ content });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
