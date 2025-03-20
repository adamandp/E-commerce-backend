import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedRoles() {
  await prisma.roles.createMany({
    data: [{ name: 'Super Admin' }, { name: 'Admin' }, { name: 'Customer' }],
  });

  console.log('Seeding Roles done');
}
