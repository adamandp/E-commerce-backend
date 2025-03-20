import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function deleteData() {
  await prisma.user.deleteMany();
  await prisma.roles.deleteMany();
  await prisma.permission.deleteMany();
  await prisma.address.deleteMany();
  await prisma.product.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.userPermission.deleteMany();
  await prisma.category.deleteMany();
  await prisma.discount.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.review.deleteMany();
  await prisma.userRoles.deleteMany();
  await prisma.userPermission.deleteMany();

  console.log('Deleting done');
}
