import { Bot } from "grammy";
import dotenv from 'dotenv';
import { InlineVoiceOperation } from "./operations/InlineVoiceOperation.js";
import { ReplyOperation } from "./operations/ReplyOperation.js";
import { ImageDistortionOperation } from "./operations/ImageDistortionOperation.js";
import { errorHandling } from "./middleware/ErrorHandlerMiddleware.js"
dotenv.config();

const bot = new Bot(process.env.BOT_TOKEN);

bot.use(errorHandling)

if (process.env.INLINE_VOICE_ENABLED) {
     await new InlineVoiceOperation().register(bot);
}

if (process.env.REPLY_ENABLED) {
    await new ReplyOperation().register(bot);
}

if (process.env.IMAGE_DISTORTION) {
    await new ImageDistortionOperation().register(bot);
}

bot.catch(x => {
    console.log(x.message)
});

process.once('SIGINT', () => bot.stop());
process.once('SIGTERM', () => bot.stop());

bot.start();
bot.catch((err) => {
    const ctx = err.ctx;
    console.error(`Error while handling update ${ctx.update.update_id}:`);
});
