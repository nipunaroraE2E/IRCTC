import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JwtPayload } from 'jsonwebtoken';
import dotenv from 'dotenv';


declare global {
  namespace Express {
    interface Request {
      user?: string | JwtPayload;  // You can customize the type as needed
    }
  }
}
// Load environment variables
dotenv.config();

// Middleware to check if the user is an admin by verifying an API key
export const verifyAdmin = (req: Request, res: Response, next: NextFunction) => {
  const apiKey = req.headers['x-api-key'];  // API Key from request headers

  if (!apiKey) {
    return res.status(403).json({ message: 'Access denied. No API key provided.' });
  }

  // Check if the API key matches the one stored in environment variables
  if (apiKey !== process.env.ADMIN_API_KEY) {
    return res.status(401).json({ message: 'Invalid API key' });
  }

  next();  // API key is valid, proceed with the request
};

// Middleware to check if the user is authenticated by verifying a JWT token
export const verifyUser = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];  // JWT token in Authorization header
  const token = authHeader && authHeader.split(' ')[1];  // Bearer <token>

  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  // Verify the JWT token
  jwt.verify(token, process.env.JWT_SECRET as string, (err: any, user: any) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }

    // Token is valid, attach user to request
    req.user = user;
    next();
  });
};
