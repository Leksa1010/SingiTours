// Node modules
import jwt from 'jsonwebtoken';

// Custom modules
import config from '@/config';

export const generateAccessToken = (userId: any) => {
    return jwt.sign({}, config.JWT_ACCESS_SECRET, {
        subject: String(userId),
        expiresIn: "15m",
    });
};

export const generateRefreshToken = (userId: any) => {
    return jwt.sign({}, config.JWT_REFRESH_SECRET, {
        subject: String(userId),
        expiresIn: "7d",
    });
};