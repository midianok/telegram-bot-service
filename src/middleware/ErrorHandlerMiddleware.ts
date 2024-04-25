import { Context, NextFunction } from "grammy";
import { Logger } from "../infrastructure/Logger.js";

export async function errorHandling(ctx: Context, next: NextFunction ): Promise<void> {
    try {
        await next();
    }
    catch (error) {
        const err = {
            error: error.code,
            errorMessage: error.message,
            stack: error.stack,
            chat: ctx.update.message.chat,
            from: ctx.update.message.from,
            reply_to_message: ctx.update.message.reply_to_message.from
        };

        Logger.error("Error:", err);

        if (process.env.OWNER_ID){
            const errJson = JSON.stringify(err, null, 4);
            await ctx.api.sendMessage(process.env.OWNER_ID, `Error: \`\`\`json\n${errJson}\n\`\`\``, { parse_mode: "MarkdownV2", });

            if (ctx.update.message.reply_to_message){
                await ctx.api.forwardMessage(process.env.OWNER_ID, ctx.chat.id, ctx.update.message.reply_to_message.message_id);
            }

            await ctx.api.forwardMessage(process.env.OWNER_ID, ctx.chat.id, ctx.message.message_id);
        }

        await ctx.reply("Что-то пошло не так :(", { reply_parameters: { message_id: ctx.message.message_id} })
    }
}
