import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Check if products exist
  const count = await prisma.product.count();
  if (count === 0) {
    console.log('Seeding products...');
    await prisma.product.createMany({
      data: [
        {
          name: 'Semaglutide Compounded Kit (0.25mg)',
          description: 'Initiation dose kit, includes 4 weeks of vials and syringes.',
          price: 299.00,
          stock: 100,
          category: 'GLP-1',
          isActive: true
        },
        {
          name: 'Tirzepatide Compounded Kit (2.5mg)',
          description: 'Initiation dose kit, dual agonist therapy.',
          price: 399.00,
          stock: 50,
          category: 'GLP-1',
          isActive: true
        }
      ]
    });
    console.log('Products seeded.');
  } else {
    console.log('Products already exist.');
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
