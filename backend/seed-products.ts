import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding products...');
  
  // Clean up existing products first (optional, but good for idempotency)
  await prisma.product.deleteMany({});

  const products = [
    {
      name: 'Semaglutide (GLP-1) Injector',
      description: 'Weekly GLP-1 receptor agonist injection for chronic weight management. Clinically proven to help patients lose up to 15% of body weight.',
      price: 299.00,
      stock: 100,
      imageUrl: '/images/products/semaglutide.png',
      category: 'Weight Loss',
      isActive: true,
    },
    {
      name: 'Tirzepatide Dual-Agonist Pen',
      description: 'Advanced once-weekly GIP and GLP-1 receptor agonist. Highly effective for substantial weight reduction and metabolic health.',
      price: 349.00,
      stock: 80,
      imageUrl: '/images/products/tirzepatide.png',
      category: 'Weight Loss',
      isActive: true,
    },
    {
      name: 'Liraglutide Daily Injector',
      description: 'Daily GLP-1 injection designed to regulate appetite and calorie intake. Ideal for consistent, steady weight loss.',
      price: 249.00,
      stock: 120,
      imageUrl: '/images/products/liraglutide.png',
      category: 'Weight Loss',
      isActive: true,
    },
    {
      name: 'Orlistat Capsules (120mg)',
      description: 'Lipase inhibitor that blocks the absorption of dietary fats. To be used alongside a reduced-calorie diet.',
      price: 89.00,
      stock: 200,
      imageUrl: '/images/products/orlistat.png',
      category: 'Weight Loss',
      isActive: true,
    },
    {
      name: 'Metformin XR Tablets',
      description: 'Extended-release tablets often prescribed off-label to assist with insulin resistance and modest weight management.',
      price: 49.00,
      stock: 300,
      imageUrl: '/images/products/metformin.png',
      category: 'Weight Loss',
      isActive: true,
    }
  ];

  for (const product of products) {
    const created = await prisma.product.create({
      data: product
    });
    console.log(`Created product: ${created.name}`);
  }

  console.log('Products seeded successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
