import { rateLimit } from 'express-rate-limit';

export const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
    standardHeaders: 'draft-7', // set `RateLimit` and `RateLimit-Policy` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
    message: { success: false, message: 'Too many requests from this IP, please try again after 15 minutes' }
});

export const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 5, // Limit each IP to 5 login requests per window
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: { success: false, message: 'Too many login attempts, please try again after 15 minutes' }
});

export const passwordLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    limit: 3, // Limit each IP to 3 password reset requests per hour
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: { success: false, message: 'Too many password reset attempts, please try again after an hour' }
});

export const emailLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    limit: 5, // Limit each IP to 5 verification emails per hour
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: { success: false, message: 'Too many verification emails requested, please try again after an hour' }
});

export const refreshLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 10,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: { success: false, message: 'Too many token refresh attempts, please try again after 15 minutes' }
});
