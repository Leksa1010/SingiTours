import dotenv from 'dotenv';
import * as process from "node:process";

// Types
import type ms from 'ms'

dotenv.config();

const config = {
    PORT: process.env.PORT || 3000,
    NODE_ENV: process.env.NODE_ENV,
    WHITELIST_ORIGINS: ['http://docs.aleksapetrovic.com'],
    MONGO_URI: process.env.MONGO_URI,
    LOG_LEVEL: process.env.LOG_LEVEL || 'info',
    JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET!,
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET!,
    JWT_ACCESS_EXPIRY: process.env.JWT_ACCESS_EXPIRY as ms.StringValue,
    JWT_REFRESH_EXPIRY: process.env.JWT_REFRESH_EXPIRY as ms.StringValue,
    WHITELIST_OPERATORS_MAIL: [
        'peric@pera.com',
        'zana@zanic.com',
    ]
};

export default config;