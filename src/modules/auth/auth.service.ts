import { RegisterInput, LoginInput, LoginResponse } from "./auth.types";
import * as repo from "./auth.repository";
import { hashPassword, comparePassword } from "../../common/utils/hash";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../../common/utils/jwt";
import { sendWelcomeEmail, sendVerificationEmail as sendVerificationEmailUtil, sendPasswordResetEmail } from "../../common/utils/email";

export const register = async (data: RegisterInput) => {
  const existing = await repo.findUserByEmail(data.email);
  if (existing) throw new Error("Email already in use");

  const hashed = await hashPassword(data.password);
  const user = await repo.createUser(data.email, hashed);

  // Send welcome email asynchronously
  sendWelcomeEmail(user.email, user.email.split('@')[0]).catch((err) => {
    console.error('Failed to send welcome email:', err);
  });

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

export const sendVerificationEmail = async (userId: string) => {
  const user = await repo.findUserById(userId);
  if (!user) throw new Error("User not found");
  if (user.isEmailVerified) throw new Error("Email already verified");

  // Generate a simple 32-char token
  const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 24); // 24 hours expiry

  await repo.createVerificationToken(user.id, token, "EMAIL_VERIFICATION", expiresAt);

  const { success, error } = await sendVerificationEmailUtil(user.email, token);
  if (!success) throw new Error("Failed to send verification email");

  return { success: true };
};

export const verifyEmail = async (token: string) => {
  const verificationToken = await repo.findVerificationToken(token);

  if (!verificationToken) {
    throw new Error("Invalid or expired verification token");
  }

  if (verificationToken.type !== "EMAIL_VERIFICATION") {
    throw new Error("Invalid token type");
  }

  if (verificationToken.expiresAt < new Date()) {
    await repo.deleteVerificationToken(verificationToken.id);
    throw new Error("Verification token has expired");
  }

  await repo.markEmailVerified(verificationToken.userId);
  await repo.deleteVerificationToken(verificationToken.id);

  return { success: true, message: "Email verified successfully" };
};

export const forgotPassword = async (email: string) => {
  const user = await repo.findUserByEmail(email);
  if (!user) {
    // For security, don't reveal if user exists. 
    // Just return success even if user not found.
    return { success: true, message: "If an account exists, a reset email has been sent." };
  }

  // Generate reset token (1h expiry)
  const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 1);

  await repo.createVerificationToken(user.id, token, "PASSWORD_RESET", expiresAt);

  const { success } = await sendPasswordResetEmail(email, token);
  if (!success) throw new Error("Failed to send reset email");

  return { success: true, message: "If an account exists, a reset email has been sent." };
};

export const resetPassword = async (token: string, newPassword: string) => {
  const resetToken = await repo.findVerificationToken(token);

  if (!resetToken || resetToken.type !== "PASSWORD_RESET") {
    throw new Error("Invalid or expired reset token");
  }

  if (resetToken.expiresAt < new Date()) {
    await repo.deleteVerificationToken(resetToken.id);
    throw new Error("Reset token has expired");
  }

  const hashed = await hashPassword(newPassword);
  await repo.updatePassword(resetToken.userId, hashed);
  await repo.deleteVerificationToken(resetToken.id);

  return { success: true, message: "Password updated successfully" };
};

export const changePassword = async (userId: string, currentPassword: string, newPassword: string) => {
  const user = await repo.findUserById(userId);
  if (!user || !user.passwordHash) throw new Error("User not found");

  const isValid = await comparePassword(currentPassword, user.passwordHash);
  if (!isValid) throw new Error("Incorrect current password");

  const hashed = await hashPassword(newPassword);
  await repo.updatePassword(userId, hashed);

  return { success: true, message: "Password changed successfully" };
};

export const logoutAll = async (userId: string) => {
  await repo.deleteAllUserSessions(userId);
  return { success: true, message: "Logged out from all devices" };
};

export const getMe = async (userId: string) => {
  const user = await repo.findUserById(userId);
  if (!user) throw new Error("User not found");

  const { passwordHash, ...userWithoutPassword } = user;
  return { success: true, data: userWithoutPassword };
};






