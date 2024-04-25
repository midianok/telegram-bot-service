import { Bot } from "grammy";

export interface Operation {
    register(bot: Bot): Promise<void>
}
