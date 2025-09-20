import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  const saltRounds = 10
  const hashedPassword = await bcrypt.hash('12345678', saltRounds)

  // 1. Buat 5 role
  await prisma.roles.createMany({
    data: [
      { name: 'admin' },
      { name: 'cashier' },
      { name: 'manager' },
      { name: 'warehouse' },
      { name: 'owner' },
    ],
    skipDuplicates: true,
  })

  // Ambil role admin & owner
  const adminRole = await prisma.roles.findFirst({ where: { name: 'admin' } })
  const ownerRole = await prisma.roles.findFirst({ where: { name: 'owner' } })

  if (!adminRole || !ownerRole) {
    throw new Error('Roles not found!')
  }

  // 2. Buat user admin
  const adminUser = await prisma.users.upsert({
    where: { email: 'admin@mail.com' },
    update: {},
    create: {
      email: 'admin@mail.com',
      username: 'admin',
      password: hashedPassword,
      roleId: adminRole.id,
    },
  })

  // 3. Buat user owner
  const ownerUser = await prisma.users.upsert({
    where: { email: 'owner@mail.com' },
    update: {},
    create: {
      email: 'owner@mail.com',
      username: 'owner',
      password: hashedPassword,
      roleId: ownerRole.id,
    },
  })

  // 4. Buat business milik owner
  await prisma.businesses.upsert({
    where: { ownerId: ownerUser.id }, 
    update: {},
    create: {
      name: 'Owner First Business',
      ownerId: ownerUser.id,
    },
  })
}

main()
  .then(() => {
    console.log('Seeding done ✅')
  })
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
