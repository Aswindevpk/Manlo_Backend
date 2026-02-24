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
