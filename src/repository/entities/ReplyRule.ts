export type ReplyRule = {
    "name": string,
    "regexPattern": string,
    "userId": number,
    "replyMessages": string[],
    "stickerIds": string[],
    "probability": number
}
