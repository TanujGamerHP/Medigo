"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    const email = 'medigo.connect@gmail.com';
    console.log(`Setting admin role for ${email}...`);
    const user = await prisma.user.upsert({
        where: { email },
        update: { role: 'Admin' },
        create: {
            email,
            role: 'Admin',
            isVerified: true,
            status: 'Active'
        }
    });
    console.log('Success! User record:', user.email, 'Role:', user.role);
}
main()
    .catch(e => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=makeAdmin.js.map