import { InlineVoice } from "./entities/InlineVoice.js";
import { ReplyRule } from "./entities/ReplyRule";

export type DataContext = {
    voices: InlineVoice[]
    replies: ReplyRule[]
}
