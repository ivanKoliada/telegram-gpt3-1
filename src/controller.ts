import { ABOUT, IMG, BOT_DESCRIPTION, NOTICE } from './constants.js';
import { generateImage } from './lib/openai.js';
import { telegram } from './lib/telegram.js';

export const commandController = async (id: number, msg: string) => {
  const [cmd, ...description] = msg.split(' ');

  switch (cmd) {
    case ABOUT:
      await telegram.sendMessage(id, BOT_DESCRIPTION);
      return null;
    case IMG:
      const descriptionImage = description.join(' ');

      const processingMessage = await telegram.sendMessage(id, NOTICE);
      const image = await generateImage(descriptionImage);
      await telegram.deleteMessage(id, processingMessage.message_id);

      image && (await telegram.sendPhoto(id, image));
      return null;
  }
};
