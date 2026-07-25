import prisma from '../src/utils/prisma.client.js';

async function main(): Promise<void> {
  await prisma.$queryRaw`SELECT 1`;
}

main()
  .catch((error: unknown) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
