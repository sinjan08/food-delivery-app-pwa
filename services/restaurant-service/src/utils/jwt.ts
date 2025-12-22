import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import { env } from '../config/env';

type JwtPayload = {
  id: number;
  email: string;
  phone: string;
  roles: string[];
};

const JWT_SECRET: Secret = env.JWT_SECRET as Secret;

export default {
  sign(
    user: { id: number; email: string; phone: string; roles: string[] },
    expiresIn?: string
  ): string {
    const payload: JwtPayload = {
      id: user.id,
      email: user.email,
      phone: user.phone,
      roles: user.roles,
    };

    const options: SignOptions = {
      expiresIn: expiresIn || ("7d" as any),
    };

    return jwt.sign(payload, JWT_SECRET, options);
  },

  verify(token: string): JwtPayload | null {
    try {
      return jwt.verify(token, JWT_SECRET) as JwtPayload;
    } catch (err) {
      console.error("JWT verification failed:", err);
      return null;
    }
  },
};
