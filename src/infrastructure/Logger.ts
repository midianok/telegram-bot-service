import winston from "winston";

export class Logger {
    private static instance: winston.Logger;

    private static createInstance() {
        Logger.instance = winston.createLogger({
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

    static info(message:string, meta?:any) {
        if (!this.instance){
            this.createInstance();
        }
        this.instance.info(message, meta);
    }

    static error(message:string, meta?:any) {
        if (!this.instance){
            this.createInstance();
        }
        this.instance.error(message, meta);
    }
}


