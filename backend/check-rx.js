const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const prescriptions = await prisma.prescription.findMany();
  console.log(JSON.stringify(prescriptions, null, 2));
}

main().finally(() => prisma.$disconnect());
