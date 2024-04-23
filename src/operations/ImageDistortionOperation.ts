import { Telegraf, Context } from "telegraf";
import { Operation } from "./Operation.js";
import fetch from 'node-fetch';

type TelegramPhoto = {
    file_id: string,
    file_size: number
}

export class ImageDistortionOperation implements Operation {
    imageManipulationServiceUrl: string;
    constructor() {
        this.imageManipulationServiceUrl = process.env.IMAGE_MANIPULATION_SERVICE_URL;
    }
    async register(bot: Telegraf<Context>): Promise<void> {
        bot.hears(/нука|Нука|жмыхни|Жмыхни/, async (ctx, next) => {
            const file = this.getFile(ctx.update.message?.reply_to_message);
            if (!file){
                return next();
            }

            const fileMeta = await fetch(`https://api.telegram.org/bot${ctx.telegram.token}/getFile?file_id=${file.fileId}`)
                .then(result => result.json());

            // @ts-ignore
            const binary = await fetch(`https://api.telegram.org/file/bot${ctx.telegram.token}/${fileMeta.result.file_path}`)
                .then( result => result.arrayBuffer());

            let url: string;
            if (file.type === 'image'){
                url = 'image/distort-image';
            }
            if (file.type === 'video' || file.type == 'videoNote'){
                url = 'image/distort-video';
            }
            const t = JSON.stringify({ base64: Buffer.from(binary).toString('base64')});
            const result = await fetch(`${this.imageManipulationServiceUrl}/${url}`, {
                method: 'POST',
                body: JSON.stringify({ base64: Buffer.from(binary).toString('base64')}),
                headers: { 'Content-Type': 'application/json' }
            }).then( res => res.json())

            // @ts-ignore
            if (!result.base64){
                return next();
            }

            // @ts-ignore
            const imgbase = Buffer.from(result.base64, 'base64');

            if (file.type === 'image'){
                // @ts-ignore
                await ctx.replyWithPhoto({ source: imgbase }, { reply_to_message_id: ctx.message.message_id })
            }
            if (file.type === 'video' || file.type == 'videoNote'){
                // @ts-ignore
                await ctx.replyWithAnimation({ source: imgbase }, { reply_to_message_id: ctx.message.message_id })
            }
        });
    }

    private getFile(replyToMessage: any): {fileId: string, type: 'video' | 'image' | 'videoNote'} {
        if (!replyToMessage){
            return undefined;
        }

        if (replyToMessage.photo){
            const imageIds = replyToMessage.photo;
            const mostQuality =  imageIds.reduce(
                (prev, current) => {
                    return prev.file_size > current.file_size ? prev : current
                }
            )
            return { fileId: mostQuality.file_id, type: 'image' }

        }

        if (replyToMessage.animation){
            return { fileId: replyToMessage.animation.file_id, type: 'video' }
        }

        if (replyToMessage.video_note){
            return { fileId: replyToMessage.video_note.file_id, type: 'video' }
        }

        return undefined;
    }
}
