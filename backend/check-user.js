const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.findUnique({
    where: { email: 'swayam1529.be23@chitkarauniversity.edu.in' },
    include: { doctor: true, patient: true }
  });
  console.log(JSON.stringify(user, null, 2));
}

main().finally(() => prisma.$disconnect());
