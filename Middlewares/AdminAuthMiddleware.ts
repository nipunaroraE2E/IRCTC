import { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';

// Load environment variables from the .env file
dotenv.config();

export const adminAuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Get token from the request headers (or from Authorization header)
  const adminToken = req.headers['x-admin-token'];

  // Check if the token matches the one in the environment variable
  if (!adminToken || adminToken !== process.env.ADMIN_TOKEN) {
    return res.status(403).json({ message: 'Forbidden: Invalid Admin Token' });
  }

  // If token is valid, allow the request to proceed
  next();
};
