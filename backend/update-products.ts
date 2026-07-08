import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Clearing existing products...');
  await prisma.orderItem.deleteMany({});
  await prisma.product.deleteMany({});

  console.log('Seeding new products...');
  await prisma.product.createMany({
    data: [
      {
        name: 'Prescription GLP Medication (Vial)',
        description: 'Prescription GLP Medication in a vial for injection. Dose varies.',
        price: 299.00,
        stock: 100,
        category: 'GLP-1 Injection',
        imageUrl: '/images/products/glp-vial.png',
        isActive: true
      },
      {
        name: 'Prescription GLP Medication (Oral)',
        description: 'Oral Dissolving Tablets. Compounded Medication for Medical Weight Management. Dose varies.',
        price: 349.00,
        stock: 100,
        category: 'GLP-1 Oral',
        imageUrl: '/images/products/glp-oral-tablets.png',
        isActive: true
      },
      {
        name: 'Wegovy® 1.5mg Tablets',
        description: 'Wegovy (semaglutide) tablets, 1.5 mg. 30 tablets per bottle.',
        price: 499.00,
        stock: 50,
        category: 'Semaglutide',
        imageUrl: '/images/products/wegovy-tablets-1-5mg.jpg',
        isActive: true
      },
      {
        name: 'Wegovy® 1.7mg Injection',
        description: 'Wegovy (semaglutide) injection, 1.7 mg. Pre-filled pens.',
        price: 899.00,
        stock: 50,
        category: 'Semaglutide',
        imageUrl: '/images/products/wegovy-injection-1-7mg.png',
        isActive: true
      },
      {
        name: 'Zepbound™ 2.5mg Injection',
        description: 'Zepbound (tirzepatide) injection, 2.5 mg. Pre-filled pens.',
        price: 999.00,
        stock: 50,
        category: 'Tirzepatide',
        imageUrl: '/images/products/zepbound-injection-2-5mg.png',
        isActive: true
      }
    ]
  });
  console.log('Products seeded successfully.');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
