import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedProducts() {
  const categories = await prisma.category.findMany();

  await prisma.product.createMany({
    data: [
      {
        name: 'Vanilla Bliss',
        categoryId: categories[1].id,
        price: 10,
        stock: 20,
        description: 'Classic vanilla ice cream with a smooth and sweet taste.',
        imageUrl: '',
        slug: 'vanilla-bliss',
      },
      {
        name: 'Chocolate Heaven',
        categoryId: categories[0].id,
        price: 12,
        stock: 15,
        description: 'Rich and creamy dark chocolate ice cream.',
        imageUrl: '',
        slug: 'chocolate-heaven',
      },
      {
        name: 'Strawberry Delight',
        categoryId: categories[2].id,
        price: 11,
        stock: 18,
        description: 'Fresh strawberry ice cream with real fruit chunks.',
        imageUrl: '',
        slug: 'strawberry-delight',
      },
      {
        name: 'Matcha Green Tea',
        categoryId: categories[3].id,
        price: 14,
        stock: 10,
        description: 'Authentic Japanese matcha green tea ice cream.',
        imageUrl: '',
        slug: 'matcha-green-tea',
      },
      {
        name: 'Cookies & Cream',
        categoryId: categories[4].id,
        price: 13,
        stock: 12,
        description:
          'Smooth vanilla ice cream mixed with crunchy cookie pieces.',
        imageUrl: '',
        slug: 'cookies-and-cream',
      },
      {
        name: 'Salted Caramel',
        categoryId: categories[5].id,
        price: 15,
        stock: 8,
        description: 'Sweet and salty caramel ice cream with a creamy texture.',
        imageUrl: '',
        slug: 'salted-caramel',
      },
      {
        name: 'Mango Tango',
        categoryId: categories[0].id,
        price: 11,
        stock: 14,
        description: 'Refreshing mango ice cream with a tropical twist.',
        imageUrl: '',
        slug: 'mango-tango',
      },
      {
        name: 'Blueberry Cheesecake',
        categoryId: categories[1].id,
        price: 16,
        stock: 9,
        description: 'Creamy cheesecake ice cream with real blueberry swirls.',
        imageUrl: '',
        slug: 'blueberry-cheesecake',
      },
    ],
  });

  console.log('Seeding Products done');
}
