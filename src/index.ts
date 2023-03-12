import TelegramBot from 'node-telegram-bot-api';
import { NOTICE, ROLE } from './constants.js';
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
      { role: ROLE.SYSTEM, content: 'You are a helpful assistant' },
      { role: ROLE.USER, content: msg.text },
    ] satisfies Messages;

    const processingMessage = await telegram.sendMessage(id, NOTICE);
    const reply = await generate(initialGeneration);
    await telegram.deleteMessage(id, processingMessage.message_id);

    telegram.sendMessage(id, reply);
    set(id, [...initialGeneration, { role: ROLE.ASSISTANT, content: reply }]);

    return;
  }

  const nextMessages = [...messages, { role: ROLE.USER, content: msg.text }] satisfies Messages;
  const processingMessage = await telegram.sendMessage(id, NOTICE);
  const reply = await generate(nextMessages);
  await telegram.deleteMessage(id, processingMessage.message_id);

  telegram.sendMessage(id, reply);
  set(id, [...nextMessages, { role: ROLE.ASSISTANT, content: reply }]);
});

telegram.on('text', (msg) => telegram.sendChatAction(msg.chat.id, 'typing'));

telegram.on('error', (err) => console.log(err.message));

process.on('SIGINT', () => process.exit(0));
