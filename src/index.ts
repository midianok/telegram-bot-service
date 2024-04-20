import { Telegraf } from 'telegraf';
import winston, { format } from 'winston';
import dotenv from 'dotenv';
import { InlineVoiceOperation } from "./operations/InlineVoiceOperation.js";
import { Operation } from "./operations/Operation.js";
import { ReplyOperation } from "./operations/ReplyOperation.js";
dotenv.config();

const logger = winston.createLogger({ transports: [new winston.transports.Console()] });

const bot = new Telegraf(process.env.BOT_TOKEN);
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))

if (process.env.WWEBHOOK_URL){
    bot.launch({ webhook: { domain: process.env.WEBHOOK_URL, port: Number(process.env.WEBHOOK_PORT) || 80 } }).then(() => logger.info("Stopped"));
    logger.info(`App started webhook "${process.env.WEBHOOK_URL}" listening on port ${process.env.WEBHOOK_PORT}`)
}
else {
    bot.launch().then(() => logger.info("Stopped"));
    logger.info('App started with polling')
}

const operations: Operation[] = []
if (process.env.INLINE_VOICE_ENABLED) {
    operations.push(new InlineVoiceOperation());
}

if (process.env.REPLY_ENABLED) {
    operations.push(new ReplyOperation());
}

for (const operation of operations) {
    await operation.register(bot);
}
