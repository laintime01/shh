// src/lib/auth.ts - 认证相关工具
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserDB } from './database';

const JWT_SECRET = process.env.JWT_SECRET!;

export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

export class AuthService {
  static async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  }

  static generateToken(payload: { userId: string; email: string; role: string }): string {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
  }

  static verifyToken(token: string): TokenPayload | null {
    try {
      return jwt.verify(token, JWT_SECRET) as TokenPayload;
    } catch {
      return null;
    }
  }

  static async authenticateUser(email: string, password: string) {
    // 首先检查是否是管理员环境变量登录
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;
    
    if (email === adminEmail && adminPasswordHash) {
      const isValid = await this.verifyPassword(password, adminPasswordHash);
      if (isValid) {
        return {
          id: 'admin',
          email: adminEmail,
          role: 'admin'
        };
      }
    }

    // 数据库用户验证
    const user = await UserDB.findByEmail(email);
    if (!user) return null;

    const isValid = await this.verifyPassword(password, user.passwordHash);
    if (!isValid) return null;

    await UserDB.updateLastLogin(email);

    return {
      id: user._id!,
      email: user.email,
      role: user.role
    };
  }
}

