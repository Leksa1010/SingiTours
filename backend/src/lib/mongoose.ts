import mongoose from "mongoose";

import config from "@/config";

import type { ConnectOptions } from "mongoose";
import {logger} from "@/lib/winston";

// Client options
const clientOptions: ConnectOptions = {
    dbName: 'SingiTours-db',
    appName: 'SingiTours-API',
    serverApi: {
        version: '1',
        strict: true,
        deprecationErrors: true
    }
}

/*
    Establishing connection to DB using Mongoose lib
    If error - log
    Using:
        Mongo_URI - as connecting string
        const clientOptions for configuration Mongoose library
*/

export const connectToDB = async(): Promise<void> => {
    if (!config.MONGO_URI) {
        throw new Error('MongoDB URI config is missing');
    }
    try {
        await mongoose.connect(config.MONGO_URI, clientOptions);
        logger.info('MongoDB Connected', {
            uri: config.MONGO_URI,
            config: clientOptions,
        });
    } catch (err) {
        if (err instanceof Error) {
            throw err;
        }
        logger.error('Error connecting to DB', err);
    }
}

/*
    Disconnecting from DB
    Async disconnect attempts
    If disconnect successful - log
    If error - show or log in console
*/

export const disconnectFromDB = async(): Promise<void> => {

    try {
        await mongoose.disconnect();
        logger.info('MongoDB Disconnected', {
            uri: config.MONGO_URI,
            config: clientOptions,
        });
    } catch (err) {
        if (err instanceof Error) {
            throw new Error (err.message);
        }
        logger.error('Error disconnecting from DB', err);
    }
}