import { Operation } from "./Operation.js";
import { Repository } from "../repository/Repository.js";
import { Logger } from "../infrastructure/Logger.js";
import { getRandomElement, probability } from "../infrastructure/Utils.js";
import { Bot } from "grammy";

export class ReplyOperation implements Operation {
    repository: Repository;

    constructor() {
        this.repository = new Repository();
    }

    async register(bot: Bot): Promise<void> {
        const replyRules = await this.repository.getReplyRules();

        for (const rule of replyRules) {
            if (rule.stickerIds.length === 0 && rule.replyMessages.length == 0) {
                Logger.info("replies is empty");
                continue;
            }

            bot.hears(new RegExp(rule.regexPattern), async (ctx, next) => {
                const userIdMatch = rule.userId ? rule.userId === ctx.update.message.from.id : true;
                const hits = rule.probability ? probability(rule.probability) : true;
                if (ctx.update.message.from.is_bot || !userIdMatch || !hits) {
                    return await next();
                }

                const replies: { type: string, value: string }[] = [];
                if (rule.replyMessages) {
                    replies.push(...rule.replyMessages.map( x => ({type: 'text', value: x})));
                }
                if (rule.stickerIds) {
                    replies.push(...rule.stickerIds.map( x => ({type: 'sticker', value: x})));
                }

                const result = getRandomElement(replies);

                if (result.type === 'text') {
                    await ctx.reply(result.value, { reply_parameters: { message_id: ctx.message.message_id} } );
                    Logger.info("Reply with text success", {...ctx.update.message, reply: result.value});
                }

                if (result.type === 'sticker') {
                    await ctx.replyWithSticker(result.value, { reply_parameters: { message_id: ctx.message.message_id} } );
                    Logger.info("reply with sticker success", {...ctx.update.message, reply: result.value});
                }
            })
        }
    }
}
