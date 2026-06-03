import { z } from 'zod';

export const dsaLanguageSchema = z.enum(['JAVASCRIPT', 'PYTHON', 'JAVA', 'CPP']);

export const submitCodeSchema = z.object({
  language: dsaLanguageSchema,
  sourceCode: z.string().min(1, 'Source code is required').max(100_000),
});

export const runCodeSchema = submitCodeSchema.extend({
  customInput: z.string().max(10_000).optional(),
  customExpectedOutput: z.string().max(10_000).optional(),
});

/** POST /problems/run and POST /problems/submit (slug in body) */
export const runCodeWithSlugSchema = runCodeSchema.extend({
  slug: z.string().min(1),
});

export const submitCodeWithSlugSchema = submitCodeSchema.extend({
  slug: z.string().min(1),
});

export const listProblemsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
  difficulty: z.enum(['EASY', 'MEDIUM', 'HARD']).optional(),
  topic: z
    .enum([
      'ARRAYS',
      'STRINGS',
      'LINKED_LISTS',
      'TREES',
      'GRAPHS',
      'DP',
      'GREEDY',
      'BINARY_SEARCH',
    ])
    .optional(),
  tag: z.string().optional(),
  search: z.string().optional(),
  status: z.enum(['all', 'solved', 'unsolved']).default('all'),
});

export type SubmitCodeInput = z.infer<typeof submitCodeSchema>;
export type RunCodeInput = z.infer<typeof runCodeSchema>;
export type ListProblemsQuery = z.infer<typeof listProblemsQuerySchema>;
