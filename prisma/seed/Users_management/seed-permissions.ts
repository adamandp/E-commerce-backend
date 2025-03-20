import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedPermissions() {
  await prisma.permission.createMany({
    data: [
      {
        name: 'E-Commerce',
      },
      {
        name: 'Admin-Dashboard',
      },
      {
        name: 'Cashier',
      },
    ],
  });

  console.log('Seeding Permissions done');
}
