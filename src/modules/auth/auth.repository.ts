import prisma from "../../config/prisma";

export const createUser = async (email: string, passwordHash: string) => {
  return await prisma.user.create({
    data: {
      email,
      passwordHash,
    },
    select: {
      id: true,
      email: true,
      role: true,
    },
  });
};

export const findUserByEmail = async (email: string) => {
  return await prisma.user.findUnique({
    where: { email },
  });
};

export const findUserById = async (id: string) => {
  return await prisma.user.findUnique({
    where: { id },
  });
};


export const createSession = async (
  userId: string,
  refreshToken: string,
  expiresAt: Date,
  userAgent?: string,
  ipAddress?: string
) => {
  return await prisma.session.create({
    data: {
      userId,
      refreshToken,
      expiresAt,
      userAgent,
      ipAddress,
    },
  });
};

export const findSessionByToken = async (refreshToken: string) => {
  return await prisma.session.findUnique({
    where: { refreshToken },
    include: { user: true },
  });
};

export const deleteSession = async (refreshToken: string) => {
  return await prisma.session.delete({
    where: { refreshToken },
  });
};

export const deleteAllUserSessions = async (userId: string) => {
  return await prisma.session.deleteMany({
    where: { userId },
  });
};


export const createVerificationToken = async (
  userId: string,
  token: string,
  type: "EMAIL_VERIFICATION" | "PASSWORD_RESET",
  expiresAt: Date
) => {
  return await prisma.verificationToken.create({
    data: {
      userId,
      token,
      type,
      expiresAt,
    },
  });
};

export const findVerificationToken = async (token: string) => {
  return await prisma.verificationToken.findUnique({
    where: { token },
    include: { user: true },
  });
};

export const deleteVerificationToken = async (id: string) => {
  return await prisma.verificationToken.delete({
    where: { id },
  });
};

export const markEmailVerified = async (userId: string) => {
  return await prisma.user.update({
    where: { id: userId },
    data: { isEmailVerified: true },
  });
};

export const updatePassword = async (userId: string, passwordHash: string) => {
  return await prisma.user.update({
    where: { id: userId },
    data: { passwordHash },
  });
};



