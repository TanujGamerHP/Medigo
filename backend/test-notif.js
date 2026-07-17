const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const u = await prisma.user.findFirst({ where: { role: 'Patient' } });
  if (u) {
    const n = await prisma.notification.create({
      data: {
        userId: u.id,
        title: 'Subscription Activated',
        message: 'Your 3-Months plan has been successfully activated.',
        type: 'system'
      }
    });
    console.log('Created notification:', n);
  } else {
    console.log('No patient found');
  }
}
main().finally(() => process.exit(0));
