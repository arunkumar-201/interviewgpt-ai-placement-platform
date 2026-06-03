import { PrismaClient } from '@prisma/client';
import { ALL_DSA_PROBLEMS } from './dsa/catalog.js';

export async function seedDsa(prisma: PrismaClient) {
  console.log('Seeding DSA problems...');

  for (const problem of ALL_DSA_PROBLEMS) {
    const record = await prisma.dsaProblem.upsert({
      where: { slug: problem.slug },
      update: {
        title: problem.title,
        description: problem.description,
        fullDescription: problem.fullDescription,
        difficulty: problem.difficulty,
        topic: problem.topic,
        tags: problem.tags,
        companies: problem.companies,
        constraints: problem.constraints,
        examples: problem.examples,
        edgeCases: problem.edgeCases,
        hints: problem.hints,
        followUp: problem.followUp ?? null,
        starterCode: problem.starterCode,
        editorial: problem.editorial,
        relatedSlugs: problem.relatedSlugs,
        orderIndex: problem.orderIndex,
        isPublished: true,
        acceptanceRate:
          problem.difficulty === 'EASY' ? 55 : problem.difficulty === 'MEDIUM' ? 42 : 28,
      },
      create: {
        slug: problem.slug,
        title: problem.title,
        description: problem.description,
        fullDescription: problem.fullDescription,
        difficulty: problem.difficulty,
        topic: problem.topic,
        tags: problem.tags,
        companies: problem.companies,
        constraints: problem.constraints,
        examples: problem.examples,
        edgeCases: problem.edgeCases,
        hints: problem.hints,
        followUp: problem.followUp ?? null,
        starterCode: problem.starterCode,
        editorial: problem.editorial,
        relatedSlugs: problem.relatedSlugs,
        orderIndex: problem.orderIndex,
        isPublished: true,
        acceptanceRate:
          problem.difficulty === 'EASY' ? 55 : problem.difficulty === 'MEDIUM' ? 42 : 28,
      },
    });

    await prisma.testCase.deleteMany({ where: { problemId: record.id } });
    await prisma.testCase.createMany({
      data: problem.testCases.map((tc, order) => ({
        problemId: record.id,
        input: tc.input,
        expectedOutput: tc.expectedOutput,
        isHidden: tc.isHidden ?? false,
        order,
      })),
    });
  }

  console.log(`Seeded ${ALL_DSA_PROBLEMS.length} DSA problems.`);
}
