import dotenv from "dotenv";
dotenv.config();

export const env = {
  APP_NAME: process.env.APP_NAME || "Auth Service",
  PORT: process.env.PORT || 4001,
  DATABASE_URL: process.env.DATABASE_URL!,
  JWT_SECRET: process.env.JWT_SECRET,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || "",
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || "",
  GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL || "",
  LOG_LEVEL: process.env.LOG_LEVEL || "info",
  VERSION: process.env.VERSION || "1",
};
