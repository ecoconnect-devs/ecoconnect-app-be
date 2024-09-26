import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const secretKey = process.env.JWT_SECRET || 'your_jwt_secret';

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader?.replace("Bearer ", "");

  if (req.path === '/login') {
    return next();
  }

  if (!token) {
    res.sendStatus(401);
    return; 
  }

  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      res.sendStatus(403);
      return;
    }
    
    req.user = user as any;
    req.token = token;
    next(); 
  });
};