import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgresql://neondb_owner:npg_g0hZtNY6Fveo@ep-black-water-a8x3ol5s-pooler.eastus2.azure.neon.tech/neondb?sslmode=require&pgbouncer=true"
    }
  }
});

async function main() {
  const users = await prisma.user.findMany();
  console.log('Users found:', users.length);
}
main().catch(console.error).finally(() => prisma.$disconnect());
