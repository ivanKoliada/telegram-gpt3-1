import { UNREADABLE_ENV } from '../constants.js';
import 'dotenv/config';
import TelegramBot from 'node-telegram-bot-api';
import invariant from 'tiny-invariant';

const token = process.env.TELEGRAM_BOT_TOKEN;
invariant(token, UNREADABLE_ENV);

export const telegram = new TelegramBot(token, { polling: true });
