import { commandController } from './controller.js';
import { Messages, generate } from './lib/openai.js';
import { redisMethods } from './lib/redis.js';
import { telegram } from './lib/telegram.js';

telegram.on('message', async (msg) => {
  if (!msg.text) return;

  const { id } = msg.chat;

  const commandReceived = await commandController(id, msg.text);

  if (commandReceived === null) return;

  const { get, set } = await redisMethods();

  const messages = await get(id);

  if (!messages) {
    const initialGeneration = [
      { role: 'system', content: 'You are a helpful assistant' },
      { role: 'user', content: msg.text },
    ] satisfies Messages;

    const reply = await generate(initialGeneration);

    telegram.sendMessage(id, reply);
    set(id, [...initialGeneration, { role: 'assistant', content: reply }]);

    return;
  }

  const nextMessages = [...messages, { role: 'user', content: msg.text }] satisfies Messages;
  const reply = await generate(nextMessages);

  telegram.sendMessage(id, reply);
  set(id, [...nextMessages, { role: 'assistant', content: reply }]);
});

telegram.on('text', (msg) => telegram.sendChatAction(msg.chat.id, 'typing'));

telegram.on('error', (err) => console.log(err.message));

process.on('SIGINT', () => process.exit(0));
