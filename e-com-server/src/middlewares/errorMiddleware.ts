import { Request, Response, NextFunction } from 'express';
import ErrorHandler from '../utils/errorHandler.js';

export const errorMiddleware = (
    err: ErrorHandler,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Something went wrong!';

    res.status(statusCode).json({
        success: false,
        error: message,
    });
};


  
