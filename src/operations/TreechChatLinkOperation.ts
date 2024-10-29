import {Bot} from "grammy";
import {Operation} from "./Operation";

export class TreechChatLinkOperation implements Operation {

    async register(bot: Bot): Promise<void> {
        bot.on("message").filter(
            (ctx) => this.filter(ctx.message.text),
            async (ctx, next) => {
                const chat = await ctx.getChat();
                await ctx.reply(`🔗*Ссылка*: \`${chat.invite_link}\``, {parse_mode: "MarkdownV2"});
            })
    }

    filter(message: string) : boolean {
        const linkMessage = ["ссылк", "дайти линк"];
        const matches = linkMessage.filter(x => message.includes(x)).length;
        return matches > 0;
    };

}
