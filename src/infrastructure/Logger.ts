import winston from "winston";

export function createLogger(){
return
}

export class Logger {
    logger : any;

    constructor() {
        this.logger = winston.createLogger({
            format: winston.format.combine(winston.format.json(), winston.format.metadata()),
            transports: [
                new winston.transports.Console({
                    format: winston.format.combine(
                        winston.format.colorize(),
                        winston.format.simple()
                    )
                })
            ],
        });
    }

    info(message:string, meta?:any) {
        this.logger.info(message, meta);
    }

    error(message:string, meta?:any) {
        this.logger.error(message, meta);
    }
}
