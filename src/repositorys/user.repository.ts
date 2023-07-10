import { prisma } from '../services/prisma';

export const createUser = async (data) => {
  const user = await prisma.user.create({
    data,
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      updatedAt: true,
      email_verified: true,
      phone: true,
    },
  });

  return user;
};

export const getUserByEmail = async (email) => {
  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  return user;
};

export const whoIam = async (id) => {
  const user = await prisma.user.findUnique({
    where: {
      id: id,
    },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      updatedAt: true,
      email_verified: true,
      phone: true,
      calendar_id: true,
    },
  });

  return user;
};

export const activeEmail = async (id) => {
  const user = await prisma.user.update({
    where: {
      id: id,
    },
    data: {
      email_verified: true,
    },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      updatedAt: true,
      email_verified: true,
      phone: true,
    },
  });

  return user;
};
