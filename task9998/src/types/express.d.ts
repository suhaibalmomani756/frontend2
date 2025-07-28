import { JwtPayload } from 'jsonwebtoken';

interface CustomJwtPayload extends JwtPayload {
  userId: string;
  role: "STUDENT" | "INSTRUCTOR";
}

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        role: "STUDENT" | "INSTRUCTOR";
        iat?: number;
        exp?: number;
      };
    }
  }
} 