import { Telegraf, Context } from "telegraf";
import { Operation } from "./Operation.js";
import { Magick } from 'magickwand.js';
import fetch from 'node-fetch';

export class ImageDistortionOperation implements Operation {

    async register(bot: Telegraf<Context>): Promise<void> {
        bot.hears(/нука|Нука|жмыхни|Жмыхни/, async (ctx, next) => {
            const imageIds : { file_id: string, file_size: number }[] = ctx.update.message.reply_to_message["photo"];
            if (!imageIds){
                return next();
            }

            const mostQuality = imageIds.reduce((prev, current) => prev.file_size > current.file_size ? prev : current)

            const fileMeta = await fetch(`https://api.telegram.org/bot${ctx.telegram.token}/getFile?file_id=${mostQuality.file_id}`)
                .then(result => result.json());

            // @ts-ignore
            const binary = await fetch(`https://api.telegram.org/file/bot${ctx.telegram.token}/${fileMeta.result.file_path}`)
                .then( result => result.blob());

            const blob = new Magick.Blob(await binary.arrayBuffer());
            const image = new Magick.Image;
            await image.readAsync(blob);
            const originalSize = image.size();
            await image.liquidRescaleAsync('40x40%!');
            await image.resizeAsync(originalSize);
            await image.writeAsync(blob);

            const replyImageBuffer = Buffer.from( await blob.base64Async(), 'base64');

            await ctx.replyWithPhoto({ source: replyImageBuffer }, { reply_parameters: { message_id: ctx.message.message_id} })
        });
    }
}
