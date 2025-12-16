import { env } from "@/config/env";
import { forgotPasswordTemplate, verifyEmailTemplate } from "@/templates/verifyEmail.template";
import { sendMail } from "@/utils/mailsend";
import bcrypt from "bcrypt";
import { randomBytes } from "node:crypto";
import * as otpgenerator from "otp-generator";
import logger from "../config/logger";
import prisma from "../config/prisma";
import jwt from "../utils/jwt";

type RegisterInput = {
  name: string;
  email: string;
  phone: string;
  password: string;
  address?: string;
  zipCode?: string;
  countryId?: number;
  stateId?: number;
  cityId?: number;
}

type AdminCreateUserInput = RegisterInput & {
  roleCode: string; // e.g. "RESTAURANT", "DELIVERY", "ADMIN"
};

class AuthService {

  private getRoleByCode = async (code: string) => {
    try {
      logger.debug(`Fetching role with code: ${code}`);
      const role = await prisma.role.findUnique({
        where: { code: code.toUpperCase() }
      });

      if (!role) {
        logger.error(`Role with code ${code} not found`);
        throw new Error('Role not found');
      }

      logger.debug(`Role fetched successfully: ${role.name}`);
      return role;
    } catch (error: any) {
      logger.error('Error fetching role:', error);
      throw new Error('An error occurred while fetching the role: ' + error.message);
    }
  }

  private assignRoleToUser = async (userId: number, roleCode: string) => {
    try {
      logger.debug(`Assigning role ${roleCode} to user ID ${userId}`);
      // getting role id by code
      const role = await this.getRoleByCode(roleCode);

      // assigning role to user
      await prisma.userRole.upsert({
        where: {
          userId_roleId: {
            userId: userId,
            roleId: role.id
          },
        },
        update: {
          userId: userId,
          roleId: role.id
        },
        create: {
          userId: userId,
          roleId: role.id
        }
      });

      return role;
    } catch (error: any) {
      logger.error('Error assigning role to user:', error);
      throw new Error('An error occurred while assigning role to user: ' + error.message);
    }
  }

  private createRefreshToken = async (userId: number) => {
    try {
      logger.debug(`Creating refresh token for user ID ${userId}`);
      // creating refresh token
      const refreshToken = randomBytes(40).toString("hex");
      // calculating expiry date
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 30);
      // creating refresh token record in database
      const rt = await prisma.refreshToken.create({
        data: {
          token: refreshToken,
          userId: userId,
          expiresAt
        }
      });

      return rt;
    } catch (error: any) {
      logger.error('Error creating refresh token:', error);
      throw new Error('An error occurred while creating refresh token: ' + error.message);
    }
  }

  async registerSelf(input: RegisterInput) {
    try {
      logger.info(`Starting self-registration with: ${input}`);
      // checking if user already exists logic here
      const existing = await prisma.user.findFirst({
        where: {
          OR: [{ email: input.email }, { phone: input.phone || undefined }],
        }
      });

      if (existing) {
        logger.warn('User with given email or phone already exists');
        throw new Error('User with given email or phone already exists');
      }

      // hashing password
      const hashed = await bcrypt.hash(input.password, 10);

      // creating user
      const user = await prisma.user.create({
        data: {
          name: input.name,
          email: input.email,
          phone: input.phone,
          password: hashed,
          address: input.address || null,
          zipCode: input.zipCode || null,
          countryId: input.countryId || null,
          stateId: input.stateId || null,
          cityId: input.cityId || null
        }
      });
      logger.info(`User created with ID: ${user.id}`);

      // assigning default role
      const role = await this.assignRoleToUser(user.id, 'USER');
      logger.info(`User registered successfully with ID: ${user.id} and role: ${role.name}`);

      // createing access token
      const accessToken = jwt.sign({
        id: user.id,
        email: input.email,
        phone: input.phone,
        roles: [role.name]
      })
      logger.debug(`Access token created for user ID ${user.id}`);

      // creating refresh token
      const refreshToken = await this.createRefreshToken(user.id);
      logger.debug(`Refresh token created for user ID ${user.id}`);

      return {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role
        },
        accessToken,
        refreshToken: refreshToken.token
      }
    } catch (error: any) {
      logger.error('Error during self-registration:', error);
      throw new Error('An error occurred during self-registration: ' + error.message);
    }
  }

  async login(email: string, password: string, phone?: string) {
    try {
      logger.info(`Attempting login for email: ${email}`);

      // 1. Check user exists
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        logger.warn('User not found');
        throw new Error('User not found');
      }

      // 2. Check if password login is allowed
      if (!user.password) {
        logger.warn('Password login not allowed for this user');
        throw new Error('This account does not support password login');
      }

      // 3. Verify password
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        logger.warn('Invalid password');
        throw new Error('Invalid password');
      }

      // 4. Fetch roles
      const userRoles = await prisma.userRole.findMany({
        where: { userId: user.id },
        include: { role: true },
      });

      const roles = userRoles.map(ur => ur.role.name);

      // 5. Create access token
      const accessToken = jwt.sign({
        id: user.id,
        email: user.email,
        phone: user.phone ?? '',
        roles,
      });

      // 6. Create refresh token
      const refreshToken = await this.createRefreshToken(user.id);

      return {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: userRoles[0]?.role ?? null,
        },
        accessToken,
        refreshToken: refreshToken.token,
      };
    } catch (error: any) {
      logger.error('Error during login:', error);
      throw new Error(error.message || 'An error occurred during login');
    }
  }


  async adminCreateUser(input: AdminCreateUserInput) {
    try {
      logger.info(`Admin creating user with: ${input}`);
      // checking if user already exists logic here
      const existing = await prisma.user.findFirst({
        where: {
          OR: [{ email: input.email }, { phone: input.phone || undefined }],
        }
      });

      if (existing) {
        logger.warn('User with given email or phone already exists');
        throw new Error('User with given email or phone already exists');
      }

      // hashing password
      const hashed = await bcrypt.hash(input.password, 10);

      // creating user
      const user = await prisma.user.create({
        data: {
          name: input.name,
          email: input.email,
          phone: input.phone,
          password: hashed, // hashed password
          address: input.address || null,
          zipCode: input.zipCode || null,
          countryId: input.countryId || null,
          stateId: input.stateId || null,
          cityId: input.cityId || null
        }
      });
      logger.info(`User created with ID: ${user.id}`);

      // assigning role
      const role = await this.assignRoleToUser(user.id, input.roleCode);
      logger.info(`Role ${role.name} assigned to user ID: ${user.id}`);

      return {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role
        }
      };
    } catch (error: any) {
      logger.error('Error during admin user creation:', error);
      throw new Error('An error occurred during admin user creation: ' + error.message);
    }
  }

  async refreshToken(refreshToken: string) {
    try {
      logger.debug(`Attempting refresh token for token: ${refreshToken}`);

      const oldToken = await prisma.refreshToken.findUnique({
        where: {
          token: refreshToken
        },
        include: { user: { include: { userRoles: { include: { role: true } } } } }
      });
      logger.debug(`Refresh token found for user ID: ${oldToken?.user.id}`);

      if (!oldToken) {
        logger.warn('Refresh token not found');
        throw new Error('Refresh token not found');
      }

      if (oldToken.expiresAt < new Date()) {
        logger.warn('Refresh token expired');
        throw new Error('Refresh token expired');
      }

      const newToken = jwt.sign({
        id: oldToken.user.id,
        email: oldToken.user.email,
        phone: oldToken.user.phone || '',
        roles: oldToken.user.userRoles.map(ur => ur.role.name)
      });
      logger.debug(`New refresh token created for user ID: ${oldToken.user.id}`);

      return { accessToken: newToken };
    } catch (err: any) {
      logger.error('Error during refresh token:', err);
      throw new Error('An error occurred during refresh token: ' + err.message);
    }
  }

  async logout(refreshToken: string) {
    try {
      logger.debug(`Attempting logout for token: ${refreshToken}`);
      const result = await prisma.refreshToken.deleteMany({
        where: {
          token: refreshToken
        }
      });
      logger.debug(`Logout successful for token: ${refreshToken}`);
      return result;
    } catch (err: any) {
      logger.error('Error during logout:', err);
      throw new Error('An error occurred during logout: ' + err.message);
    }
  }

  async validateUser(email: string, password: string) {
    try {
      logger.debug(`Validating user with email: ${email}`);
      // finding user by email
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        logger.warn('User not found during validation');
        return null;
      }

      return user;
    } catch (err: any) {
      logger.error('Error during user validation:', err);
      throw new Error('An error occurred during user validation: ' + err.message);
    }
  }

  async loginViaGoogle(profile: any) {
    const email = profile.emails?.[0]?.value;
    const providerUserId = profile.id;

    let user = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          {
            oauthAccounts: {
              some: {
                provider: "google",
                providerUserId,
              }
            }
          }
        ]
      },
      include: {
        userRoles: { include: { role: true } }
      }
    });

    if (!user) {
      // auto-register new google user
      user = await prisma.user.create({
        data: {
          name: profile.displayName || "Google User",
          email,
          password: crypto.randomUUID(), // technical password
          oauthAccounts: {
            create: {
              provider: "google",
              providerUserId,
            },
          },
        },
        include: {
          userRoles: { include: { role: true } }
        }
      });

      // assign role USER
      await this.assignRoleToUser(user.id, "USER");
    }

    return user;
  }

  async completeGoogleLogin(user: any) {
    const roles = user.userRoles.map((ur: any) => ur.role.code);

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        roles,
      },
      accessToken: jwt.sign({
        id: user.id,
        email: user.email,
        phone: user.phone || '',
        roles,
      }),
      refreshToken: (await this.createRefreshToken(user.id)).token,
    };
  }


  async generateOtp(phoneNumber: string) {
    {
      try {
        logger.debug(`Sending OTP to phone number: ${phoneNumber}`);

        let user = await prisma.user.findUnique({ where: { phone: phoneNumber } });

        if (!user) {
          user = await prisma.user.create({
            data: {
              name: "Anonymous",
              email: `anon_${Date.now()}@yopmail.com`,
              password: crypto.randomUUID(),
            },
            include: {
              userRoles: { include: { role: true } }
            }
          });
        }

        const otp = otpgenerator.generate(6, {
          upperCaseAlphabets: false,
          lowerCaseAlphabets: false,
          specialChars: false,
        });
        logger.info(`Generated OTP: ${otp} for phone number: ${phoneNumber}`);

        const expiry = new Date();
        expiry.setMinutes(expiry.getMinutes() + 10); // OTP valid for 10 minutes

        await prisma.verificationToken.create({
          data: {
            userId: user.id,
            token: otp,
            type: 'PHONE',
            expiresAt: expiry,
          }
        });

        return otp;
      } catch (error: any) {
        logger.error('Error sending OTP:', error);
        throw new Error('An error occurred while sending OTP: ' + error.message);
      }
    }
  }


  async verifyOtp(phoneNumber: string, otp: string) {
    try {
      logger.debug(`Verifying OTP for phone number: ${phoneNumber}`);

      const user = await prisma.user.findUnique({
        where: { phone: phoneNumber },
        include: {
          userRoles: { include: { role: true } }
        }
      });

      if (!user) {
        throw new Error('User not found');
      }

      const verificationToken = await prisma.verificationToken.findFirst({
        where: {
          userId: user.id,
          token: otp,
          type: 'PHONE',
        },
      });

      if (!verificationToken) {
        throw new Error('Invalid OTP');
      }

      if (verificationToken.expiresAt < new Date()) {
        throw new Error('OTP has expired');
      }

      return {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.phone || '',
          roles: user.userRoles.map(ur => ur.role.name),
        },
        accessToken: jwt.sign({
          id: user.id,
          email: user.email,
          phone: user.phone || '',
          roles: user.userRoles.map(ur => ur.role.name),
        }),
        refreshToken: (await this.createRefreshToken(user.id)).token
      };
    } catch (error: any) {
      logger.error('Error verifying OTP:', error);
      throw new Error('An error occurred while verifying OTP: ' + error.message);
    }
  }


  async getLoggedInUser(userId: number) {
    try {
      logger.debug(`Fetching logged in user with ID: ${userId}`);
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          userRoles: { include: { role: true } },
          country: true,
          state: true,
          city: true,
        }
      });

      if (!user) {
        throw new Error('User not found');
      }

      return user;
    } catch (err: any) {
      logger.error('Error fetching logged in user:', err);
      throw new Error('An error occurred while fetching logged in user: ' + err.message);
    }
  }

  async sendVerificationMail(userId: number) {
    try {
      logger.debug(`Sending verification email to user ID: ${userId}`);
      const user = await prisma.user.findUnique({ where: { id: userId } });
      if (!user) {
        throw new Error('User not found');
      }
      // delete old tokens
      await prisma.verificationToken.deleteMany({
        where: { userId, type: "EMAIL" },
      });
      // generate token
      const rawToken = crypto.randomUUID();
      const hashed = await bcrypt.hash(rawToken, 10);

      const expires = new Date();
      expires.setHours(expires.getHours() + 1);

      await prisma.verificationToken.create({
        data: {
          token: hashed,
          type: "EMAIL",
          expiresAt: expires,
          userId: user.id,
        },
      });

      const link = `${env.FRONTEND_URL}/verify-email?token=${rawToken}&uid=${user.id}`;

      const mailBody = await verifyEmailTemplate(user.name, link);
      // send email
      const info = await sendMail(
        user.email,
        `Verify your email for ${env.APP_NAME}`,
        mailBody
      );

      logger.info(`Verification email sent to ${user.email}: ${info.messageId}`);

      return info;

    } catch (error: any) {
      logger.error('Error sending verification email:', error);
      throw new Error('An error occurred while sending verification email: ' + error.message);
    }
  }


  async verifyEmailLink(token: string, uid: any) {
    try {
      logger.debug(`Verifying email link for user ID: ${uid}`);
      const userId = parseInt(uid, 10);
      const record = await prisma.verificationToken.findFirst({
        where: {
          userId,
          type: "EMAIL",
        },
      });

      if (!record) {
        throw new Error('Invalid verification token');
      }

      const isValid = await bcrypt.compare(token, record.token);
      if (!isValid) {
        throw new Error('Invalid verification token');
      }

      if (record.expiresAt < new Date()) {
        throw new Error('Verification token has expired');
      }

      await prisma.verificationToken.deleteMany({
        where: { userId, type: "EMAIL" },
      });

      return await prisma.user.update({
        where: { id: userId },
        data: { emailVerifiedAt: new Date() },
      });
    } catch (error: any) {
      logger.error('Error verifying email link:', error);
      throw new Error('An error occurred while verifying email link: ' + error.message);
    }
  }

  async forgotPassword(email: string) {
    try {
      logger.debug(`Attempting password reset for email: ${email}`);
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        throw new Error('User not found');
      }

      const rawToken = crypto.randomUUID();
      const hashed = await bcrypt.hash(rawToken, 10);

      const expires = new Date();
      expires.setHours(expires.getHours() + 1);

      await prisma.verificationToken.create({
        data: {
          token: hashed,
          type: "FORGOT_PASSWORD",
          expiresAt: expires,
          userId: user.id,
        },
      });

      const link = `${env.FRONTEND_URL}/reset-password?token=${rawToken}&uid=${user.id}`;

      const mailBody = await forgotPasswordTemplate(user.name, link);
      // send email
      const info = await sendMail(
        user.email,
        `Reset your password for ${env.APP_NAME}`,
        mailBody
      );

      logger.info(`Password reset email sent to ${user.email}: ${info.messageId}`);

      return info;
    } catch (error: any) {
      logger.error('Error during password reset:', error);
      throw new Error('An error occurred during password reset: ' + error.message);
    }
  }

  async resetPassword(token: string, uid: any, password: string) {
    try {
      logger.debug(`Attempting password reset for uid: ${uid}`);

      const userId = parseInt(uid, 10);

      const record = await prisma.verificationToken.findFirst({
        where: {
          userId,
          type: 'FORGOT_PASSWORD',
        },
      });

      if (!record) {
        throw new Error('Invalid or expired verification token');
      }

      const isValid = await bcrypt.compare(token, record.token);
      if (!isValid) {
        throw new Error('Invalid or expired verification token');
      }

      if (record.expiresAt < new Date()) {
        throw new Error('Verification token has expired');
      }

      // hash new password
      const hashedPassword = await bcrypt.hash(password, 10);

      // delete all forgot-password tokens for user
      await prisma.verificationToken.deleteMany({
        where: { userId, type: 'FORGOT_PASSWORD' },
      });

      // update password
      await prisma.user.update({
        where: { id: userId },
        data: { password: hashedPassword },
      });

      return true;
    } catch (error: any) {
      logger.error('Error during password reset:', error);
      throw new Error(error.message || 'Password reset failed');
    }
  }

}

export default new AuthService();