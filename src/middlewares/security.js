import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cors from 'cors';
import express from 'express';

const securityMiddleware = (app) => {
    app.use(helmet()); // Security headers
    app.use(cors()); // CORS policy
    app.use(express.json());

    // Rate limiting to prevent brute force attacks
    const limiter = rateLimit({
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100, // Limit each IP to 100 requests per windowMs
        message: 'Too many requests, please try again later.'
    });
    app.use(limiter);
};

export default securityMiddleware;
