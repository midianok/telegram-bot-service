import { Context, NextFunction } from "grammy";
import {Logger} from "../infrastructure/Logger.js";

export async function errorHandling(ctx: Context, next: NextFunction ): Promise<void> {
    try{
        await next();
    }
    catch (error) {
        Logger.error("request", { error, ctx });
        await ctx.reply("Что-то пошло не так :(", { reply_parameters: { message_id: ctx.message.message_id} })
    }
}
