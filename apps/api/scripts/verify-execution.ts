/**
 * Verifies DSA code execution (local fallback + optional Judge0).
 * Usage: npx tsx apps/api/scripts/verify-execution.ts
 */
import { localJudgeService } from '../src/services/local-judge.service.js';

const TWO_SUM_PYTHON = `import json, sys

def two_sum(nums, target):
    seen = {}
    for i, n in enumerate(nums):
        if target - n in seen:
            return [seen[target - n], i]
        seen[n] = i
    return []

if __name__ == "__main__":
    data = json.loads(sys.stdin.read())
    print(json.dumps(two_sum(data["nums"], data["target"])))
`;

async function main() {
  console.log('=== DSA Execution Verification ===\n');

  const testCases = [
    { input: '{"nums":[2,7,11,15],"target":9}', expectedOutput: '[0,1]' },
    { input: '{"nums":[3,2,4],"target":6}', expectedOutput: '[1,2]' },
  ];

  const verdicts = await localJudgeService.runTests(TWO_SUM_PYTHON, 'PYTHON', testCases, 5000);

  let allPassed = true;
  verdicts.forEach((v, i) => {
    const ok = v.passed && v.status === 'ACCEPTED';
    console.log(`Test ${i + 1}: ${ok ? 'PASS' : 'FAIL'} (${v.status})`);
    console.log(`  stdout: ${v.stdout}`);
    if (!ok) {
      allPassed = false;
      console.log(`  stderr: ${v.stderr}`);
    }
  });

  console.log('\n' + (allPassed ? '✅ Local execution verified' : '❌ Local execution failed'));
  process.exit(allPassed ? 0 : 1);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
