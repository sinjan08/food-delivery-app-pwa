import bcrypt from "bcrypt";
import { randomBytes } from "node:crypto";
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
      // checking if user exists
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) {
        logger.warn('User not found');
        throw new Error('User not found');
      }

      // verifying password
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        logger.warn('Invalid password');
        throw new Error('Invalid password');
      }

      // fetching user roles
      const userRoles = await prisma.userRole.findMany({
        where: { userId: user.id },
        include: { role: true }
      });
      const roles = userRoles.map(ur => ur.role.name);

      // creating access token
      const accessToken = jwt.sign({
        id: user.id,
        email: user.email,
        phone: user.phone || '',
        roles
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
          role: userRoles[0].role
        },
        accessToken,
        refreshToken: refreshToken.token
      };
    } catch (error: any) {
      logger.error('Error during login:', error);
      throw new Error('An error occurred during login: ' + error.message);
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
}

export default new AuthService();