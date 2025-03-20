import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export async function seedUsers() {
  const adminRoles = await prisma.roles.findUnique({
    where: {
      name: 'Admin',
    },
  });

  const customerRoles = await prisma.roles.findUnique({
    where: {
      name: 'Customer',
    },
  });

  const ecommercePermission = await prisma.permission.findUnique({
    where: { name: 'E-Commerce' },
  });

  const adminDashboardPermission = await prisma.permission.findUnique({
    where: { name: 'Admin-Dashboard' },
  });

  await prisma.user.create({
    data: {
      username: 'exampleadminuser',
      fullName: 'Admin User',
      email: 'admin@example.com',
      regionId: 'ID001',
      phoneNumber: '1234567890',
      password: await bcrypt.hash('@Password123', 10),
      gender: 'MAN',
      isActive: true,
      imageUrl: 'https://example.com/adminimage.jpg',
      userPermissions: {
        create: {
          permissionId: adminDashboardPermission?.id,
        },
      },
      userRoles: {
        create: {
          rolesId: adminRoles?.id,
        },
      },
      Cart: {
        create: {},
      },
    },
  });

  await prisma.user.create({
    data: {
      username: 'examplecutomeruser',
      fullName: 'Customer User',
      email: 'customer@example.com',
      regionId: 'ID002',
      phoneNumber: '0987654321',
      password: await bcrypt.hash('@Password123', 10),
      gender: 'WOMAN',
      isActive: true,
      imageUrl: 'https://example.com/customerimage.jpg',
      userPermissions: {
        create: {
          permissionId: ecommercePermission?.id,
        },
      },
      userRoles: {
        create: {
          rolesId: customerRoles?.id,
        },
      },
      Cart: {
        create: {},
      },
    },
  });

  console.log('Seeding Users done');
}
