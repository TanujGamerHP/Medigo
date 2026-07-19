const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const docs = await prisma.user.findMany({where: {role: 'Doctor'}, take: 1, include: { doctor: true }});
  const pats = await prisma.user.findMany({where: {role: 'Patient'}, take: 1, include: { patient: true }});
  console.log(JSON.stringify({docs, pats}, null, 2));
}
main().finally(() => prisma.$disconnect());
