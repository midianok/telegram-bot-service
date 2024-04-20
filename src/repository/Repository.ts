import { JSONFilePreset   } from 'lowdb/node'
import { DataContext } from "./DataContext";
import { InlineVoice } from "./entities/InlineVoice";
import { ReplyRule } from "./entities/ReplyRule";

export class Repository {
    defaultDataContext: DataContext;
    constructor() {
        this.defaultDataContext = {
            voices: [],
            replies: []
        }
    }

    async getInlineVoices(predicate: (voice: InlineVoice ) => boolean ): Promise<InlineVoice[]> {
        const db = await JSONFilePreset<DataContext>('data/db.json', this.defaultDataContext)
        return db.data.voices.filter(predicate);
    }

    async getReplyRules(): Promise<ReplyRule[]> {
        const db = await JSONFilePreset<DataContext>('data/db.json', this.defaultDataContext)
        return db.data.replies;
    }
}
