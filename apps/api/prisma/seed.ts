import { PrismaClient } from '@prisma/client';
import { DEFAULT_COMPANIES } from '@interviewgpt/shared';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding default companies...');

  for (const company of DEFAULT_COMPANIES) {
    await prisma.company.upsert({
      where: { slug: company.slug },
      update: { name: company.name, isActive: true },
      create: {
        slug: company.slug,
        name: company.name,
        isActive: true,
      },
    });
  }

  console.log(`Seeded ${DEFAULT_COMPANIES.length} companies.`);
}

main()
  .catch((error) => {
    console.error('Seed failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
