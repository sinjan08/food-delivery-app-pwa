import logger from "@/config/logger";
import dayjs from "dayjs";
import { nanoid } from "nanoid";


export const generateCode = async (roleCode: string) => {
  try {
    const substrCode = roleCode.toUpperCase().substring(0, 3);

    return `${substrCode}-${dayjs().format("YYMMDDhhmmss")}-${nanoid(4).toUpperCase()}`;
  } catch (error: any) {
    logger.error("Error generating code:", error);
    throw new Error("An error occurred while generating code: " + error.message);
  }
}


export function timeToMinute(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}
