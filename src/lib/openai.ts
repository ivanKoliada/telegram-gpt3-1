import { type CreateChatCompletionRequest, Configuration, OpenAIApi } from 'openai';
import invariant from 'tiny-invariant';
import 'dotenv/config';

export type Messages = CreateChatCompletionRequest['messages'];

const apiKey = process.env.OPENAI_API_KEY;

invariant(apiKey, "Couldn't read the openai apiKey url environment variable");

const configuration = new Configuration({
  apiKey,
});

const openai = new OpenAIApi(configuration);

export async function generate(messages: Messages): Promise<string> {
  try {
    const chatCompletion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages,
    });

    const payload = chatCompletion.data.choices.pop();

    const reply = payload?.message && payload.message.content;

    return reply ? reply : 'receive a response from the ai but comes empty';
  } catch (error) {
    return 'receive a error from the ai';
  }
}

export async function generateImage(message: string): Promise<string> {
  try {
    const imageParameters = {
      model: 'image-alpha-001',
      prompt: message,
      n: 1,
    };

    const response = await openai.createImage(imageParameters);

    const urlData = response.data.data[0].url;

    return urlData ? urlData : 'receive a response from the ai but comes empty';
  } catch (error) {
    return 'receive a error from the ai';
  }
}
