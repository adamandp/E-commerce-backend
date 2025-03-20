import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedCart() {
  const carts = await prisma.cart.findMany();
  const products = await prisma.product.findMany();

  await prisma.cartItem.createMany({
    data: [
      {
        CartId: carts[0].id,
        productId: products[0].id,
        quantity: 10,
      },
      {
        CartId: carts[0].id,
        productId: products[1].id,
        quantity: 30,
      },
      {
        CartId: carts[0].id,
        productId: products[2].id,
        quantity: 3,
      },
      {
        CartId: carts[1].id,
        productId: products[3].id,
        quantity: 2,
      },
      {
        CartId: carts[1].id,
        productId: products[0].id,
        quantity: 15,
      },
      {
        CartId: carts[1].id,
        productId: products[1].id,
        quantity: 5,
      },
    ],
  });

  console.log('Seeding Products done');
}
