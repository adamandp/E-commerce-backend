import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedAddress() {
  const isAdminUser = await prisma.user.findUnique({
    where: {
      username: 'exampleadminuser',
    },
  });

  const isCustomerUser = await prisma.user.findUnique({
    where: {
      username: 'examplecutomeruser',
    },
  });

  await prisma.address.createMany({
    data: [
      {
        userId: isAdminUser!.id,
        province: 'Bali',
        city: 'Badung',
        subdistrict: 'Kuta Selatan',
        village: 'Jimbaran',
        postalCode: 40141,
        address: 'yu bali yu',
        isPrimary: true,
      },
      {
        userId: isAdminUser!.id,
        province: 'Kalimantan',
        city: 'Pontianak',
        subdistrict: 'Kota Pontianak',
        village: 'Mariana',
        postalCode: 60226,
        address: 'aduh mba eli nih menggoda banget',
        isPrimary: false,
      },
      {
        userId: isCustomerUser!.id,
        province: 'Jakarta',
        city: 'Jakarta Pusat',
        subdistrict: 'Menteng',
        village: 'Menteng',
        postalCode: 40141,
        address: 'kayyyye',
        isPrimary: true,
      },
      {
        userId: isCustomerUser!.id,
        province: 'Jawa barat',
        city: 'Bandung',
        subdistrict: 'Bandung kidul',
        village: 'Batununggal',
        postalCode: 40266,
        address: 'test',
        isPrimary: false,
      },
    ],
  });

  console.log('Seeding Address done');
}
