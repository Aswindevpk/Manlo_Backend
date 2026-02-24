import jwt from "jsonwebtoken";
import { env } from "../../config/env";

export const generateAccessToken = (payload: object) => {
  return jwt.sign(payload, env.jwt.accessSecret, {
    expiresIn: "15m",
  });
};

export const generateRefreshToken = (payload: object) => {
  return jwt.sign(payload, env.jwt.refreshSecret, {
    expiresIn: "7d",
  });
};
