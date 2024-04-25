import {Api, Bot, Context, RawApi} from "grammy";

export interface Operation {
    register(bot: Bot): Promise<void>
}
