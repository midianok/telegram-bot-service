import {Bot} from "grammy";
import {Operation} from "./Operation";

export class TreechChatLinkOperation implements Operation {

    async register(bot: Bot): Promise<void> {
        bot.on("message").filter(
            (ctx) => this.filter(ctx.message.text),
            async (ctx, next) => {
                const chat = await ctx.getChat();
                await ctx.reply(`🔗*Ссылка на чат*: \`${chat.invite_link}\``, {parse_mode: "MarkdownV2"});
                await ctx.reply(chat.invite_link);
            })
    }

    filter(message: string) : boolean {
        if (!message){
            return false;
        }

        const linkMessage = ["ссылк"];
        const matches = linkMessage.filter(x => message.toLowerCase().includes(x)).length;
        return matches > 0;
    };

}
