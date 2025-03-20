import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedCategories() {
  await prisma.category.createMany({
    data: [
      {
        name: 'Cake',
      },
      {
        name: 'Classic',
      },
      {
        name: 'Cornetto',
      },
      {
        name: 'Fruit Based',
      },
      {
        name: 'Gelato',
      },
      {
        name: 'Low Calorie',
      },
      {
        name: 'Vegan',
      },
    ],
  });

  console.log('Categories seeded successfully!');
}
