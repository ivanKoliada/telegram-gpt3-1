import { ChatCompletionRequestMessageRoleEnum } from 'openai';

export const ABOUT = '/about';

export const IMG = '/img';

export const NOTICE = 'ChatGPT обрабатывает ваш запрос, это может занять некоторое время';

export const ERROR_AI = 'Ошибка в работе ChatGPT';

export const EMPTY_RESPONSE = 'ChatGPT обработал ваш запрос, но ничего не ответил';

export const UNREADABLE_ENV = 'Failed to read environment variable';

export const ROLE: Record<string, ChatCompletionRequestMessageRoleEnum> = {
  USER: 'user',
  SYSTEM: 'system',
  ASSISTANT: 'assistant',
};

export const BOT_DESCRIPTION = `
  Привет!

  Бот использует модель gpt-3.5-turbo.

  Бот умеет:
  - Отвечать на вопросы
  - Писать и редактировать тексты
  - Переводить с любого языка на любой
  - Писать и редактировать код

  Вы можете общаться с ботом, как с живым собеседником, задавая вопросы на любом языке. 
  Обратите внимание, что бот обладает ограниченными знаниями о событиях после 2021 года.

  Чтобы получить текстовый ответ, просто напишите в чат ваш вопрос

  Чтобы получить изображение, начните свой запрос с /img, а затем введите текст.

  Например: /img конь в розовом пальто
`;
