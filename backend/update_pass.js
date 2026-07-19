const crypto = require('crypto');
const { PrismaClient } = require('@prisma/client');

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

const prisma = new PrismaClient();

async function main() {
  const docEmail = 'swayam1529.be23@chitkarauniversity.edu.in';
  
  const newHash = hashPassword('Swayam@30');

  await prisma.user.updateMany({
    where: { email: docEmail },
    data: { passwordHash: newHash }
  });

  console.log('Doctor password restored to "Swayam@30".');
}

main().finally(() => prisma.$disconnect());
