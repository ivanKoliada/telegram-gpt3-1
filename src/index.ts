import { Messages, generate } from './lib/openai.js';
import { redisMethods } from './lib/redis.js';
import { telegram } from './lib/telegram.js';

telegram.on('message', async (msg) => {
  console.log(msg);
  if (!msg.text) return;
  const { id } = msg.chat;

  const { get, set } = await redisMethods();

  const messages = await get(id);

  if (!messages) {
    const initialGeneration = [
      { role: 'system', content: 'You are a helpful assistant' },
      { role: 'user', content: msg.text },
    ] satisfies Messages;
    const generation = await generate(initialGeneration);
    telegram.sendMessage(id, generation.message);
    set(id, [...initialGeneration, { role: 'assistant', content: generation.message }]);
    return;
  }

  const nextMessages = [...messages, { role: 'user', content: msg.text }] satisfies Messages;
  const generation = await generate(nextMessages);

  telegram.sendMessage(id, generation.message);
  set(id, [...nextMessages, { role: 'assistant', content: generation.message }]);
});

telegram.on('text', (msg) => {
  telegram.sendChatAction(msg.chat.id, 'typing');
});

telegram.on('error', (err) => console.log(err.message));

process.on('SIGINT', () => {
  process.exit(0);
});
