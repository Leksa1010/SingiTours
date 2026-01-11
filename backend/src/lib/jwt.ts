// Node modules
import jwt from 'jsonwebtoken';

// Custom modules
import config from '@/config';

// Types
import { Types } from 'mongoose'

export const generateAccessToken = (userId: Types.ObjectId): string => {
    return jwt.sign({userId}, config.JWT_ACCESS_SECRET, {
        expiresIn: config.JWT_ACCESS_EXPIRY,
        subject: 'Access Token',
    })
}

export const generateRefreshToken = (userId: Types.ObjectId): string => {
    return jwt.sign({userId}, config.JWT_REFRESH_SECRET, {
        expiresIn: config.JWT_REFRESH_EXPIRY,
        subject: 'Refresh Token',
    })
}