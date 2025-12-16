import { env } from '@/config/env';
import { PrismaPg } from "@prisma/adapter-pg";
// import { PrismaClient } from "@prisma/client";
import "dotenv/config";
import { Pool } from "pg";
import { PrismaClient } from './../../prisma/generated/client';

const connectionString = env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL is not set in .env");
}

// PostgreSQL pool + Prisma adapter
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

export default prisma;