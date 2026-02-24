import { RegisterInput, LoginInput } from "./auth.types";
import * as repo from "./auth.repository";
import { hashPassword, comparePassword } from "../../common/utils/hash";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../common/utils/jwt";

export const register = async (data: RegisterInput) => {
  const hashed = await hashPassword(data.password);
  const user = await repo.createUser(data.email, hashed);
  return user;
};

export const login = async (data: LoginInput) => {
  const user = await repo.findUserByEmail(data.email);

  if (!user) throw new Error("User not found");

  const isValid = await comparePassword(data.password, user.password);
  if (!isValid) throw new Error("Invalid credentials");

  const accessToken = generateAccessToken({
    userId: user.id,
    role: user.role,
  });

  const refreshToken = generateRefreshToken({
    userId: user.id,
  });

  return { accessToken, refreshToken };
};
