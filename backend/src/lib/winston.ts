import winston, {transport} from 'winston';

/*
    Custom modules
*/
import config from '@/config'

const { combine, timestamp, json, errors, align, printf, colorize } = winston.format;

const transports: winston.transport[] = []

if (config.NODE_ENV != 'production]') {
    transports.push(
        new winston.transports.Console({
            format: combine(
                colorize({ all: true }), // Colors for all log levels
                timestamp({ format: 'YYYY-MM-DD HH:mm:ss A' }), // Adding timestamp to log
                align(), // Align log messages
                printf(({ timestamp, level, message, ...meta }) => {
                    const metaStr = Object.keys(meta).length
                        ? `\n${JSON.stringify(meta, null, 2)}`
                        : '';
                    return `[${timestamp}] [${level}]: ${message}${metaStr}`;
                })
            )
        })
    );
}

// Logger instance creation
const logger = winston.createLogger({
    level: config.LOG_LEVEL || 'info', // default level for logging levels into info
    // JSON logging format
    format: combine(timestamp(), errors({ stack: true }), json()),
    transports,
    silent: config.NODE_ENV === 'test', // Disable logs in test env

})

export { logger };