import * as dotenv from "dotenv";
dotenv.config();

export const jwtConfig = {
  secret: process.env.JWTSECRET || '',
}