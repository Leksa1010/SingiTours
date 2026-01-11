import { rateLimit } from 'express-rate-limit';

// Configuration and limit with purpose of attack reduction
const limiter = rateLimit({
    windowMs: 60000, // 1 minute
    limit: 60, // max requests per IP address per window
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: {
        error:
        'Too many requests. Try again later',
    },
})

export default limiter;