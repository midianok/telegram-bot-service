import { Bot } from "grammy";
import { InlineQueryResult } from "grammy/types";
import { Repository } from "../repository/Repository.js";
import { Operation } from "./Operation";
import { InlineVoice } from "../repository/entities/InlineVoice.js";

export class InlineVoiceOperation implements Operation {
    voices: InlineVoice[] = [];

    async register(bot: Bot): Promise<void> {
        if (this.voices || this.voices.length === 0) {
            const repository = new Repository();
            this.voices = await repository.getInlineVoices(() => true);
        }

        bot.on('inline_query', async (ctx) => {
            const response = await this.processQuery(ctx.update.inline_query.query);
            await ctx.answerInlineQuery(response);
        });
    }

    private async processQuery(query: string): Promise<InlineQueryResult[]> {
        const voices = this.voices.filter(x => x.title.toLowerCase().includes(query.toLowerCase()));
        return voices.map(x => ({
            id: x.id.toString(),
            type: 'voice',
            voice_file_id: x.voiceFileId,
            title: x.title
        }));
    }
}
