import { ABOUT, BOT_DESCRIPTION, IMG, NOTICE, ROLE } from './constants.js';
import { Messages, generate, generateImage } from './lib/openai.js';
import { redisMethods } from './lib/redis.js';
import { telegram } from './lib/telegram.js';

telegram.on('message', async (msg) => {
  if (!msg.text) return;
  
  const { id } = msg.chat;
  
  const [cmd, ...description] = msg.text.split(' ');
  
  if (cmd === ABOUT) {
    return telegram.sendMessage(id, BOT_DESCRIPTION);
  }

  const processingMessage = await telegram.sendMessage(id, NOTICE);

  if (cmd === IMG) {
    const descriptionImage = description.join(' ');
    const image = await generateImage(descriptionImage);
    await telegram.deleteMessage(id, processingMessage.message_id);

    return telegram.sendPhoto(id, image);
  }

  const { get, set } = await redisMethods();

  const messageHistory = await get(id);

  const messages = messageHistory
    ? messageHistory
    : [
        { role: ROLE.SYSTEM, content: 'You are a helpful assistant' },
        { role: ROLE.USER, content: msg.text },
      ];

  const nextMessages = [...messages, { role: ROLE.USER, content: msg.text }] satisfies Messages;
  const reply = await generate(nextMessages);
  await telegram.deleteMessage(id, processingMessage.message_id);

  telegram.sendMessage(id, reply);
  set(id, [...nextMessages, { role: ROLE.ASSISTANT, content: reply }]);
});

telegram.on('text', (msg) => telegram.sendChatAction(msg.chat.id, 'typing'));

telegram.on('error', (err) => console.log(err.message));

process.on('SIGINT', () => process.exit(0));
