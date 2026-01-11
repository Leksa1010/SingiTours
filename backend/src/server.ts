import express from "express";
import cors, { CorsOptions } from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import compression from "compression";
import path from "path";

import config from "@/config";
import limiter from "@/lib/express_rate_limit";
import { connectToDB, disconnectFromDB } from "@/lib/mongoose";
import { logger } from "@/lib/winston";

import v1Router from "@/routes/v1";

const app = express();

const corsOptions: CorsOptions = {
    credentials: true, // ✅ bitno za httpOnly cookie auth
    origin(origin, callback) {
        if (config.NODE_ENV === "development" || !origin || config.WHITELIST_ORIGINS.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error(`CORS error: ${origin} not allowed`), false);
            logger.warn(`CORS error: ${origin} not allowed`);
        }
    },
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/uploads", express.static(path.resolve(process.cwd(), "uploads")));

app.use(compression({ threshold: 1024 }));
app.use(helmet());

app.use("/api/v1/auth", limiter);

app.use("/api/v1", v1Router);

let server: ReturnType<typeof app.listen>;

const start = async () => {
    try {
        await connectToDB();

        server = app.listen(config.PORT, () => {
            logger.info(`Server running on http://localhost:${config.PORT}`);
        });
    } catch (err) {
        logger.error("Server starting failed", err);
        process.exit(1);
    }
};

start();

const handleServerShutdown = async () => {
    try {
        logger.warn("Server shutdown initiated");

        if (server) {
            await new Promise<void>((resolve) => server.close(() => resolve()));
        }

        await disconnectFromDB();

        logger.warn("Server shutdown completed");
        process.exit(0);
    } catch (err) {
        logger.error("Error during shutdown", err);
        process.exit(1);
    }
};

process.on("SIGTERM", handleServerShutdown);
process.on("SIGINT", handleServerShutdown);
