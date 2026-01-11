import express from "express";
import cors, {CorsOptions} from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import compression from "compression";
import path from 'path'

// Custom modules
import config from "@/config";
import limiter from "@/lib/express_rate_limit";
import { connectToDB, disconnectFromDB } from "@/lib/mongoose";
import { logger } from '@/lib/winston'

// Router
import v1Router from "@/routes/v1";


// Express server
const app = express();

// CORS options configuration
const corsOptions: CorsOptions = {
    origin(origin, callback) {
        if (config.NODE_ENV === 'development' || !origin || config.WHITELIST_ORIGINS.includes(origin)) {
            callback(null, true);
        } else {
            // Rejecting all non whitelisted requests towards the server
            callback(new Error(`CORS error: ${origin} not allowed`), false);
            logger.warn(`CORS error: ${origin} not allowed`)
        }
    },
}

// Defining CORS middleware-a
app.use(cors(corsOptions));

// JSON request body parsing

app.use(express.json());

/*
    Allowing URL-encoded request body parsing using extender
    extended is set on true (extended: true), allows objects or query string arrays
*/
app.use(express.urlencoded({extended: true}));

app.use(cookieParser());

// Static serving for uploads
app.use("/uploads", express.static(path.resolve(process.cwd(), "uploads")));


// Adding response compression in order to avoid complex payload thus maximising performance
app.use(
    compression({
        threshold: 1024,
    }),
);

// Improving security using different HTTP headers
app.use(helmet());

// Rate limit
app.use(limiter);

/*
    Instant loading async function in order to start the server
    Tries to connect to db before server initialization
    Defined API route '/api/v1'
    Starting the app on port and have URL level log
    If Error exists, it's logged to console
*/

(async () => {

    await connectToDB();
    try {
        app.use('/api/v1', v1Router);

        app.listen(config.PORT, () => {
            logger.info(`Server running on port http://localhost:${config.PORT}`);
        });
    } catch (err) {
        logger.error('Server starting failed', err)

        if (config.NODE_ENV === 'production') {
            process.exit(1);
        }
    }
})();

/*
    Server functionality during shutdown (db disconnect)
    Attempt db disconnect
    Log successful message if disconnect is success
    If error happens it is logged to db
    Exit process with status code 0 - represents success (shutdown)
*/

const handleServerShutdown = async () => {

    await disconnectFromDB();

    try {
        logger.warn("Server shutdown");
        process.exit(0)
    } catch (err) {
        logger.error("Error during shutdown", err);
    }
}

/*
    Signal events
    SIGTERM - stopping processes (kill)
    SIGINT - when user interacts - interrupt process (ctrl + c)
    When signals arrive and when shutdown executes, they ensure right shutdown
*/

process.on('SIGTERM', handleServerShutdown);
process.on('SIGINT', handleServerShutdown);

