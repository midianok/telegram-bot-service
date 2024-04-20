import { Context, Telegraf } from "telegraf";

export interface Operation {
    register(bot: Telegraf<Context>): Promise<void>
}
