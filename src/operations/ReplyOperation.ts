import { Telegraf, Context } from "telegraf";
import { Update } from "telegraf/typings/core/types/typegram.js";
import { Operation } from "./Operation.js";
import { Repository } from "../repository/Repository.js";
import { Logger } from "../infrastructure/Logger.js";
import { getRandomElement, probability } from "../infrastructure/Utils.js";

export class ReplyOperation implements Operation {
    repository: Repository;
    logger: Logger;

    constructor() {
        this.repository = new Repository();
        this.logger = new Logger();
    }

    async register(bot: Telegraf<Context<Update>>): Promise<void> {
        const replyRules = await this.repository.getReplyRules();

        for (const rule of replyRules) {
            if (rule.stickerIds.length === 0 && rule.replyMessages.length == 0) {
                this.logger.info("replies is empty");
                continue;
            }

            bot.hears(rule.regexPattern, async (ctx, next) => {
                const userIdMatch = rule.userId ? rule.userId === ctx.update.message.from.id : true;
                const hits = rule.probability ? probability(rule.probability) : true;
                if (ctx.update.message.from.is_bot || !userIdMatch || !hits) {
                    return next();
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
                    this.logger.info("Reply with text success", {...ctx.update.message, reply: result.value});
                }

                if (result.type === 'sticker') {
                    await ctx.replyWithSticker(result.value, { reply_parameters: { message_id: ctx.message.message_id} } );
                    this.logger.info("reply with sticker success", {...ctx.update.message, reply: result.value});
                }
            })
        }
    }
}
