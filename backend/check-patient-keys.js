const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
prisma.patient.findFirst().then(p => console.log(Object.keys(p))).finally(() => prisma.$disconnect());
