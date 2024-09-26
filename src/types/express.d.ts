import { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: { id: string; email: string }; // Adjust this type according to your user structure
      token?: string;
    }
  }
}