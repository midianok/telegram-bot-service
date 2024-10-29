import { Bot } from "grammy";
import dotenv from 'dotenv';
import { InlineVoiceOperation } from "./operations/InlineVoiceOperation.js";
import { ReplyOperation } from "./operations/ReplyOperation.js";
import { ImageDistortionOperation } from "./operations/ImageDistortionOperation.js";
import { TreechChatLinkOperation } from "./operations/TreechChatLinkOperation.js";
import { errorHandling } from "./middleware/ErrorHandlerMiddleware.js"
dotenv.config();

const bot = new Bot(process.env.BOT_TOKEN);

bot.use(errorHandling)

if (process.env.INLINE_VOICE_ENABLED == "true") {
     await new InlineVoiceOperation().register(bot);
}

if (process.env.REPLY_ENABLED === "true") {
    await new ReplyOperation().register(bot);
}

if (process.env.IMAGE_DISTORTION === "true") {
    await new ImageDistortionOperation().register(bot);
}

if (process.env.TREECH_CHAT_LINK_ENABLED === "true") {
    await new TreechChatLinkOperation().register(bot);
}

bot.catch(x => {
    console.log(x.message)
});

process.once('SIGINT', () => bot.stop());
process.once('SIGTERM', () => bot.stop());

bot.start();
