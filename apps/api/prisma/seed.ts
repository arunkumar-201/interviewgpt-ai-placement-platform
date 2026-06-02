import { PrismaClient, Role, AuthProvider } from '@prisma/client';
import { DEFAULT_COMPANIES } from '@interviewgpt/shared';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function seedCompanies() {
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

async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL ?? 'admin@interviewgpt.dev';
  const password = process.env.ADMIN_PASSWORD ?? 'ChangeMeAdmin1';
  const name = process.env.ADMIN_NAME ?? 'Platform Admin';

  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.user.upsert({
    where: { email: email.toLowerCase() },
    update: {
      name,
      passwordHash,
      role: Role.ADMIN,
      authProvider: AuthProvider.EMAIL,
      emailVerified: true,
      isActive: true,
    },
    create: {
      email: email.toLowerCase(),
      name,
      passwordHash,
      role: Role.ADMIN,
      authProvider: AuthProvider.EMAIL,
      emailVerified: true,
      isActive: true,
      profile: { create: {} },
    },
  });

  console.log(`Admin user seeded: ${email}`);
}

async function main() {
  await seedCompanies();
  await seedAdmin();
}

main()
  .catch((error) => {
    console.error('Seed failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
