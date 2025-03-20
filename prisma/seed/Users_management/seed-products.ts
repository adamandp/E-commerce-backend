import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedCategories() {
  const categories = await prisma.category.findMany();
  await prisma.product.createMany({
    data: [
      {
        name: 'name test',
        categoryId: categories[0].id,
        price: 5,
        stock: 10,
        description: 'description test',
        imageUrl: '',
        slug: 'slug test',
      },
    ],
  });

  console.log('Categories seeded successfully!');
}
