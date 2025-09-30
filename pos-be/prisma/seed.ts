import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  const saltRounds = 10
  const hashedPassword = await bcrypt.hash('12345678', saltRounds)

  // Makes 5 role
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

  // Get role admin & owner
  const adminRole = await prisma.roles.findFirst({ where: { name: 'admin' } })
  const ownerRole = await prisma.roles.findFirst({ where: { name: 'owner' } })

  if (!adminRole || !ownerRole) {
    throw new Error('Roles not found!')
  }

  // Admin user
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

  // Owner user
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

  // Business
  await prisma.businesses.upsert({
    where: { ownerId: ownerUser.id },
    update: {},
    create: {
      name: 'Owner First Business',
      ownerId: ownerUser.id,
    },
  })
  // Category
  await prisma.category.createMany({
    data: [
      { name: 'Food' },
      { name: 'Drink' },
      { name: 'Office stationery' },
      { name: 'Electronic' },
      { name: 'Health' }
    ]
  })
  const categories = await prisma.category.findMany()

  // Helper: cari id kategori by name
  const getCategoryId = (name: string) =>
    categories.find((c) => c.name === name)?.id || null

  // Buat produk (2 tiap kategori)
  await prisma.product.createMany({
    data: [
      // Food
      {
        name: 'Instant Noodles',
        sku: 'FOOD-001',
        price: 2500,
        stock: 100,
        categoryId: getCategoryId('Food'),
      },
      {
        name: 'Biscuits',
        sku: 'FOOD-002',
        price: 5000,
        stock: 50,
        categoryId: getCategoryId('Food'),
      },

      // Drink
      {
        name: 'Mineral Water 600ml',
        sku: 'DRINK-001',
        price: 3000,
        stock: 200,
        categoryId: getCategoryId('Drink'),
      },
      {
        name: 'Cola Can 250ml',
        sku: 'DRINK-002',
        price: 7000,
        stock: 80,
        categoryId: getCategoryId('Drink'),
      },

      // Office stationery
      {
        name: 'Ballpoint Pen',
        sku: 'OFFICE-001',
        price: 4000,
        stock: 120,
        categoryId: getCategoryId('Office stationery'),
      },
      {
        name: 'Notebook A5',
        sku: 'OFFICE-002',
        price: 10000,
        stock: 60,
        categoryId: getCategoryId('Office stationery'),
      },

      // Electronic
      {
        name: 'USB Cable',
        sku: 'ELEC-001',
        price: 15000,
        stock: 40,
        categoryId: getCategoryId('Electronic'),
      },
      {
        name: 'LED Bulb 10W',
        sku: 'ELEC-002',
        price: 20000,
        stock: 70,
        categoryId: getCategoryId('Electronic'),
      },

      // Health
      {
        name: 'Vitamin C 500mg',
        sku: 'HEALTH-001',
        price: 25000,
        stock: 90,
        categoryId: getCategoryId('Health'),
      },
      {
        name: 'Pain Relief Ointment',
        sku: 'HEALTH-002',
        price: 18000,
        stock: 40,
        categoryId: getCategoryId('Health'),
      },
    ],
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
