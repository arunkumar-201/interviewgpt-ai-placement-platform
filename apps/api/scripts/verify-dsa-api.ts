/**
 * End-to-end DSA API verification.
 * Usage: npx tsx apps/api/scripts/verify-dsa-api.ts
 */
const API = process.env.API_URL ?? 'http://localhost:4000/api/v1';
const EMAIL = process.env.TEST_EMAIL ?? 'admin@interviewgpt.dev';
const PASSWORD = process.env.TEST_PASSWORD ?? 'ChangeMeAdmin1';

async function login(): Promise<string> {
  const res = await fetch(`${API}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
  });
  const setCookie = res.headers.get('set-cookie') ?? '';
  const match = setCookie.match(/ig_access_token=([^;]+)/);
  if (!match) {
    const body = await res.text();
    throw new Error(`Login failed (${res.status}): ${body}`);
  }
  return `ig_access_token=${match[1]}`;
}

async function apiGet(path: string, cookie: string) {
  const res = await fetch(`${API}${path}`, { headers: { Cookie: cookie } });
  const body = await res.json();
  return { status: res.status, body };
}

async function apiPost(path: string, cookie: string, data: unknown) {
  const res = await fetch(`${API}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Cookie: cookie },
    body: JSON.stringify(data),
  });
  const body = await res.json();
  return { status: res.status, body };
}

async function main() {
  console.log('=== DSA API Verification ===\n');

  const cookie = await login();
  console.log('✅ Login successful\n');

  const list = await apiGet('/problems?limit=5', cookie);
  console.log(`GET /problems → ${list.status}`);
  if (list.status !== 200 || !list.body.success) {
    console.error(JSON.stringify(list.body, null, 2));
    process.exit(1);
  }
  const problems = list.body.data.data as { slug: string; title: string }[];
  console.log(`  Found ${list.body.data.meta.total} problems (showing ${problems.length})`);
  problems.forEach((p) => console.log(`  - ${p.slug}: ${p.title}`));

  const slug = 'climbing-stairs';
  const detail = await apiGet(`/problems/${slug}`, cookie);
  console.log(`\nGET /problems/${slug} → ${detail.status}`);
  if (detail.status !== 200) {
    console.error(JSON.stringify(detail.body, null, 2));
    process.exit(1);
  }
  const problem = detail.body.data;
  console.log(`  Title: ${problem.title}`);
  console.log(`  Hints: ${problem.hints?.length ?? 0}`);
  console.log(`  Editorial: ${problem.editorial ? 'yes' : 'no'}`);
  console.log(`  Companies: ${problem.companies?.join(', ') ?? 'none'}`);
  console.log(`  Examples: ${problem.examples?.length ?? 0}`);

  const starter = problem.starterCode.PYTHON as string;

  const run = await apiPost(`/problems/${slug}/run`, cookie, {
    language: 'PYTHON',
    sourceCode: starter,
  });
  console.log(`\nPOST /problems/${slug}/run → ${run.status}`);
  console.log(`  Status: ${run.body.data?.status}`);
  console.log(`  Passed: ${run.body.data?.passedTests}/${run.body.data?.totalTests}`);
  if (run.body.data?.errorMessage) {
    console.log(`  Error: ${run.body.data.errorMessage}`);
  }

  const submit = await apiPost(`/problems/${slug}/submit`, cookie, {
    language: 'PYTHON',
    sourceCode: starter,
  });
  console.log(`\nPOST /problems/${slug}/submit → ${submit.status}`);
  console.log(`  Status: ${submit.body.data?.status}`);
  console.log(`  Passed: ${submit.body.data?.passedTests}/${submit.body.data?.totalTests}`);
  if (submit.body.data?.runtimeMs != null) {
    console.log(`  Runtime: ${submit.body.data.runtimeMs} ms`);
  }

  const subs = await apiGet(`/problems/${slug}/submissions`, cookie);
  console.log(`\nGET /problems/${slug}/submissions → ${subs.status}`);
  console.log(`  Submissions: ${subs.body.data?.length ?? 0}`);

  const ready = await fetch(`${API}/ready`).then((r) => r.json());
  console.log(`\nGET /ready judge0: ${ready.data?.judge0} (${ready.data?.judge0Mode})`);
  console.log(`  ${ready.data?.judge0Detail}`);

  const runOk = run.body.data?.passedTests > 0;
  const submitOk = submit.body.data?.status === 'ACCEPTED';

  console.log('\n' + (runOk && submitOk ? '✅ DSA API + execution verified' : '⚠️  Partial success — check execution'));
  process.exit(runOk && submitOk ? 0 : 1);
}

main().catch((err) => {
  console.error('❌', err.message);
  process.exit(1);
});
