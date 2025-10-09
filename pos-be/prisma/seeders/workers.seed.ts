import { Businesses, Role } from "@prisma/client";
import prisma from "../../src/utils/prisma.js";
import bcrypt from "bcrypt";
import {faker} from '@faker-js/faker'
import { logger } from "../../src/utils/logger.js";

export async function workerSeeder(businesses: Businesses[], roles: Role[]) {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash("password123", saltRounds); 

  const getRoleId = (name: string) => roles.find((r) => r.name === name)?.id || null;

  const workerRoles = ["admin", "manager", "cashier", "warehouse"];

  for (const business of businesses) {
    for (const roleName of workerRoles) {
      const roleId = getRoleId(roleName);
      if (!roleId) continue;

      const username = faker.person.firstName()
      const email = `${username}@mail.com`;

      await prisma.worker.create({
        data: {
          username,
          email,
          password: hashedPassword,
          roleId,
          businessId: business.id,
        },
      });
    }
  }
  logger.info('workers seed successfully running')

  return prisma.worker.findMany();
}
