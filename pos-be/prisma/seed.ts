import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  const saltRounds = 10
  const hashedPassword = await bcrypt.hash('12345678', saltRounds)

  // Roles
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

  const adminRole = await prisma.roles.findFirst({ where: { name: 'admin' } })
  const ownerRole = await prisma.roles.findFirst({ where: { name: 'owner' } })

  if (!adminRole || !ownerRole) throw new Error('Roles not found!')

  // Admin
  await prisma.users.upsert({
    where: { email: 'admin@mail.com' },
    update: {},
    create: {
      email: 'admin@mail.com',
      username: 'admin',
      password: hashedPassword,
      roleId: adminRole.id,
    },
  })

  // Owner
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
  const business = await prisma.businesses.upsert({
    where: { ownerId: ownerUser.id },
    update: {},
    create: {
      name: 'Owner First Business',
      ownerId: ownerUser.id,
    },
  })

  // Categories
  await prisma.category.createMany({
    data: [
      { name: 'Food' },
      { name: 'Drink' },
      { name: 'Office stationery' },
      { name: 'Electronic' },
      { name: 'Health' },
    ],
    skipDuplicates: true,
  })

  const categories = await prisma.category.findMany()
  const getCategoryId = (name: string) =>
    categories.find((c) => c.name === name)?.id || null

  // Products
  await prisma.product.createMany({
    data: [
      {
        name: 'Instant Noodles',
        sku: 'FOOD-001',
        price: 2500,
        stock: 100,
        categoryId: getCategoryId('Food'),
        businessId: business.id,
      },
      {
        name: 'Biscuits',
        sku: 'FOOD-002',
        price: 5000,
        stock: 50,
        categoryId: getCategoryId('Food'),
        businessId: business.id,
      },
      {
        name: 'Mineral Water 600ml',
        sku: 'DRINK-001',
        price: 3000,
        stock: 200,
        categoryId: getCategoryId('Drink'),
        businessId: business.id,
      },
      {
        name: 'Cola Can 250ml',
        sku: 'DRINK-002',
        price: 7000,
        stock: 80,
        categoryId: getCategoryId('Drink'),
        businessId: business.id,
      },
      {
        name: 'Ballpoint Pen',
        sku: 'OFFICE-001',
        price: 4000,
        stock: 120,
        categoryId: getCategoryId('Office stationery'),
        businessId: business.id,
      },
      {
        name: 'Notebook A5',
        sku: 'OFFICE-002',
        price: 10000,
        stock: 60,
        categoryId: getCategoryId('Office stationery'),
        businessId: business.id,
      },
      {
        name: 'USB Cable',
        sku: 'ELEC-001',
        price: 15000,
        stock: 40,
        categoryId: getCategoryId('Electronic'),
        businessId: business.id,
      },
      {
        name: 'LED Bulb 10W',
        sku: 'ELEC-002',
        price: 20000,
        stock: 70,
        categoryId: getCategoryId('Electronic'),
        businessId: business.id,
      },
      {
        name: 'Vitamin C 500mg',
        sku: 'HEALTH-001',
        price: 25000,
        stock: 90,
        categoryId: getCategoryId('Health'),
        businessId: business.id,
      },
      {
        name: 'Pain Relief Ointment',
        sku: 'HEALTH-002',
        price: 18000,
        stock: 40,
        categoryId: getCategoryId('Health'),
        businessId: business.id,
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
