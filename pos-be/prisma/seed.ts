import { PrismaClient } from '@prisma/client'
import { categorySeeder } from './seeders/categories.seed'
import { roleSeeder } from './seeders/roles.seed'
import { userSeeder } from './seeders/users.seed'
import { productSeeder } from './seeders/product.seed'
import { businessSeeder } from './seeders/bussines.seed'
import { workerSeeder } from './seeders/workers.seed'
import { stockMovementSeeder } from './seeders/stockMovement.seed'
import { saleSeeder } from './seeders/sales.seed'
import { cashflowSeeder } from './seeders/cashFlow.seed'
import { logger } from '../src/utils/logger'
const prisma = new PrismaClient()

async function main() {
  const roles = await roleSeeder()
  const users = await userSeeder(roles)
  const businesses = await businessSeeder(users)
  const categories = await categorySeeder(businesses)
  const products = await productSeeder(categories,businesses)
  const workers = await workerSeeder(businesses,roles)
  const stockMovement = await stockMovementSeeder(businesses,products)
  const sales = await saleSeeder(businesses[0],products)
  const cashFlow = await cashflowSeeder(businesses,workers,sales)
  
}

main()
  .then(() => {
    logger.info('Seeding done')
  })
  .catch((e) => {
    logger.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
