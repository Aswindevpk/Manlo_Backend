import { RegisterInput, LoginInput, LoginResponse } from "./auth.types";
import * as repo from "./auth.repository";
import { hashPassword, comparePassword } from "../../common/utils/hash";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../common/utils/jwt";

export const register = async (data: RegisterInput) => {
  const existing = await repo.findUserByEmail(data.email);
  if (existing) throw new Error("Email already in use");

  const hashed = await hashPassword(data.password);
  const user = await repo.createUser(data.email, hashed);
  return user;
};

export const login = async (data: LoginInput): Promise<LoginResponse> => {
  const user = await repo.findUserByEmail(data.email);

  if (!user || !user.passwordHash) throw new Error("Invalid credentials");

  const isValid = await comparePassword(data.password, user.passwordHash);
  if (!isValid) throw new Error("Invalid credentials");

  const accessToken = generateAccessToken({
    userId: user.id,
    role: user.role,
  });

  const refreshToken = generateRefreshToken({
    userId: user.id,
  });

  // Calculate expiration date (7 days matches jwt config)
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  await repo.createSession(
    user.id,
    refreshToken,
    expiresAt,
    data.userAgent,
    data.ipAddress
  );

  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
    },
  };
};

export const logout = async (refreshToken: string) => {
  await repo.deleteSession(refreshToken);
};

export const refresh = async (refreshToken: string, userAgent?: string, ipAddress?: string): Promise<LoginResponse> => {
  const session = await repo.findSessionByToken(refreshToken);

  if (!session || session.expiresAt < new Date()) {
    if (session) await repo.deleteSession(refreshToken);
    throw new Error("Invalid or expired refresh token");
  }

  const { user } = session;

  const newAccessToken = generateAccessToken({
    userId: user.id,
    role: user.role,
  });

  const newRefreshToken = generateRefreshToken({
    userId: user.id,
  });

  // Rotate refresh token
  await repo.deleteSession(refreshToken);

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);

  await repo.createSession(
    user.id,
    newRefreshToken,
    expiresAt,
    userAgent,
    ipAddress
  );

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
    },
  };
};
