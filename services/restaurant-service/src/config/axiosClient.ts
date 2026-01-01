import axios from "axios";
import { env } from "./env";

export const axiosInstance = axios.create({
  baseURL: env.AUTH_SERVICE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance
