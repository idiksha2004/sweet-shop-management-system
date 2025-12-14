import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { getRepository } from 'typeorm';
import { User } from '../models/User';

export interface AuthenticatedRequest extends Request {
  user?: User;
}

export const auth = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      throw new Error('Authentication required');
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret') as { 
      id: string; 
      email: string; 
      role: string 
    };

    // Find user by id
    const userRepository = getRepository(User);
    const user = await userRepository.findOne(decoded.id);

    if (!user) {
      throw new Error('User not found');
    }

    // Add user to request object
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ 
      status: 'error',
      message: 'Please authenticate' 
    });
  }
};

// Middleware to check if user is admin
export const isAdmin = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ 
      status: 'error',
      message: 'Access denied. Admin privileges required.' 
    });
  }
  next();
};