import { Context, Telegraf } from "telegraf";
import { Repository } from "../repository/Repository.js";
import { InlineQueryResultCachedVoice } from "@telegraf/types/inline";
import { Operation } from "./Operation";

export class InlineVoiceOperation implements Operation {
    repository: Repository;

    constructor() {
        this.repository = new Repository();
    }

    async register(bot: Telegraf<Context>): Promise<void> {
        bot.on('inline_query', async (ctx) => {
            const response = await this.processQuery(ctx.update.inline_query.query);
            await ctx.answerInlineQuery(response);
        });
    }

    private async processQuery(query: string): Promise<InlineQueryResultCachedVoice[]> {
        const voices = await this.repository.getInlineVoices(x => x.title.toLowerCase().includes(query.toLowerCase()));
        return voices.map(x => ({
            id: x.id.toString(),
            type: 'voice',
            voice_file_id: x.voiceFileId,
            title: x.title
        }));
    }
}
