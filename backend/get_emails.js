const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const doc = await prisma.user.findFirst({where: {role: 'Doctor'}});
  const pat = await prisma.user.findFirst({where: {role: 'Patient'}});
  const appt = await prisma.appointment.findFirst({
    include: { doctor: { include: { user: true } }, patient: { include: { user: true } } }
  });
  console.log(JSON.stringify({docEmail: doc?.email, patEmail: pat?.email, apptDoc: appt?.doctor?.user?.email, apptPat: appt?.patient?.user?.email}, null, 2));
}
main().finally(() => prisma.$disconnect());
