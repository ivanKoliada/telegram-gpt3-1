import { UNREADABLE_ENV } from '../constants.js';
import { Messages } from '@/lib/openai.js';
import { Redis } from '@upstash/redis/with-fetch';
import invariant from 'tiny-invariant';

const url = process.env.UPSTASH_URL;
const token = process.env.UPSTASH_TOKEN;

invariant(url, UNREADABLE_ENV);
invariant(token, UNREADABLE_ENV);

export const redis = new Redis({
  url,
  token,
});

export async function redisMethods() {
  async function get(id: number | string) {
    let key = id.toString();
    try {
      const payload = await redis.get<Messages>(key);

      return payload;
    } catch (error) {
      console.log(error);
    }
  }

  async function set<T extends Messages | string>(id: string | number, messages: T) {
    let key = id.toString();
    try {
      return redis.set(key, JSON.stringify(messages), { ex: 3600 }); // data expires in 1 hours
    } catch (error) {
      console.log(error);
    }
  }

  return {
    get,
    set,
  };
}
