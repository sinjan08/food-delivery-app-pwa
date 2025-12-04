
import jwt from 'jsonwebtoken';
import { env } from '../config/env';


type JwtPayload = {
  id: number;
  email: string;
  phone: string;
  roles: string[];
};

export default {
  sign(user: { id: number; email: string; phone: string; roles: string[] }) {
    try {
      // Implement JWT signing logic here using JWT_SECRET
      const payload: JwtPayload = {
        id: user.id,
        email: user.email,
        phone: user.phone,
        roles: user.roles,
      };
      // creting jwt token
      const token = jwt.sign(payload, env.JWT_SECRET, { expiresIn: "7d" });
      return token;
    } catch (err) {
      console.error('JWT signing failed:', err);
      throw err;
    }
  },

  verify(token: string): JwtPayload | null {
    try {
      const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;
      return decoded;
    } catch (err) {
      console.error('JWT verification failed:', err);
      return null;
    }
  },
}