import { createProblem } from './helpers.js';
import { BATCH_01 } from './problems/batch01.js';
import { BATCH_02 } from './problems/batch02.js';
import { BATCH_03 } from './problems/batch03.js';
import { BATCH_04 } from './problems/batch04.js';
import { BATCH_05 } from './problems/batch05.js';

const ALL_DEFINITIONS = [
  ...BATCH_01,
  ...BATCH_02,
  ...BATCH_03,
  ...BATCH_04,
  ...BATCH_05,
];

if (ALL_DEFINITIONS.length !== 50) {
  throw new Error(`Expected 50 DSA seed problems, got ${ALL_DEFINITIONS.length}`);
}

export const ALL_DSA_PROBLEMS = ALL_DEFINITIONS.map(createProblem);
