import { PrismaClient } from '@prisma/client';
import { deleteData } from './seed-delete';
import { seedRoles } from './Users_management/seed-roles';
import { seedPermissions } from './Users_management/seed-permissions';
import { seedUsers } from './Users_management/seed-user';
import { seedAddress } from './Users_management/seed-address';
import { seedCategories } from './Users_management/seed-categories';
import { seedProducts } from './e-commerce/seed-products';
import { seedCart } from './e-commerce/seed-cart';

const prisma = new PrismaClient();

async function main() {
  await deleteData();
  await seedRoles();
  await seedPermissions();
  await seedUsers();
  await seedAddress();
  await seedCategories();
  await seedProducts();
  await seedCart();
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
