import { Bot } from "grammy";
import { InlineQueryResult } from "grammy/types";
import { Repository } from "../repository/Repository.js";
import { Operation } from "./Operation";

export class InlineVoiceOperation implements Operation {
    repository: Repository;

    constructor() {
        this.repository = new Repository();
    }

    async register(bot: Bot): Promise<void> {
        bot.on('inline_query', async (ctx) => {
            const response = await this.processQuery(ctx.update.inline_query.query);
            await ctx.answerInlineQuery(response);
        });
    }

    private async processQuery(query: string): Promise<InlineQueryResult[]> {
        const voices = await this.repository.getInlineVoices(x => x.title.toLowerCase().includes(query.toLowerCase()));
        return voices.map(x => ({
            id: x.id.toString(),
            type: 'voice',
            voice_file_id: x.voiceFileId,
            title: x.title
        }));
    }
}
