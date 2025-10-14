import prisma from "../utils/prisma.js";

export const isEmailTaken = async (email: string) => {
  const [user, worker] = await Promise.all([
    prisma.user.findUnique({ where: { email } }),
    prisma.worker.findUnique({ where: { email } }),
  ]);
  return !!(user || worker);
};
