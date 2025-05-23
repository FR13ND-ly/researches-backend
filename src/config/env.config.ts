import { config } from "dotenv";
config();

const env = process.env;

interface AppEnvInterface {
  JWT_SECRET: string,
  FRONTEND_HOST: string,
  BACKEND_HOST: string,
}

export const AppEnv: AppEnvInterface = {
  JWT_SECRET: env.JWT_SECRET as any,
  FRONTEND_HOST: env.FRONTEND_HOST as any,
  BACKEND_HOST: env.BACKEND_HOST as any,
}