const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkDb() {
  try {
    const start = Date.now();
    await prisma.$queryRaw`SELECT 1`;
    console.log(`DB Connection successful. Latency: ${Date.now() - start}ms`);
  } catch (err) {
    console.error("DB Connection failed:", err.message);
  } finally {
    await prisma.$disconnect();
  }
}

checkDb();
