/**
 * E2E Validation Script (Pure JS, Node 18+ fetch)
 * Validates the full RRSS AUTO flow end to end.
 */

const API_BASE = 'http://localhost:3000';
const EMAIL = `e2e_test_${Date.now()}@example.com`;
const PASSWORD = 'password123';

let jwtToken = '';
let userId = '';
let workspaceId;
let businessId;
let campaignId;
let contentId;
let assetId;
let publicationId;

function pass(step) { console.log(`  ✓ ${step}`); }
function fail(step, err) { console.error(`  ✗ FAIL [${step}]: ${err}`); process.exit(1); }

async function post(path, body, token) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${API_BASE}${path}`, { method: 'POST', headers, body: JSON.stringify(body) });
  const text = await res.text();
  let data;
  try { data = JSON.parse(text); } catch { data = text; }
  return { ok: res.ok, status: res.status, data };
}

async function get(path, token) {
  const headers = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${API_BASE}${path}`, { method: 'GET', headers });
  const text = await res.text();
  let data;
  try { data = JSON.parse(text); } catch { data = text; }
  return { ok: res.ok, status: res.status, data };
}

async function run() {
  console.log('\n========================================');
  console.log('  RRSS AUTO — E2E Validation v1.0.0     ');
  console.log('========================================\n');

  // ─── STEP 1: Health Check ─────────────────────────────────────────────────
  console.log('[STEP 1] Health Check');
  {
    const r = await get('/health');
    if (!r.ok) fail('Health Check', `HTTP ${r.status}: ${JSON.stringify(r.data)}`);
    pass(`API is healthy: ${JSON.stringify(r.data)}`);
  }

  // ─── STEP 2: User Registration ────────────────────────────────────────────
  console.log('\n[STEP 2] User Registration');
  {
    const r = await post('/users', { email: EMAIL, displayName: 'E2E Tester', password: PASSWORD });
    if (!r.ok) fail('Registration', `HTTP ${r.status}: ${JSON.stringify(r.data)}`);
    userId = r.data.userId;
    const verificationCode = r.data.verificationCode;
    pass(`Registered userId=${userId}, code=${verificationCode}`);

    // ─── STEP 3: Email Verification ─────────────────────────────────────────
    console.log('\n[STEP 3] Email Verification');
    const v = await post('/auth/verify', { userId, code: verificationCode });
    if (!v.ok) fail('Email Verification', `HTTP ${v.status}: ${JSON.stringify(v.data)}`);
    pass('Account verified');
  }

  // ─── STEP 4: Login ────────────────────────────────────────────────────────
  console.log('\n[STEP 4] Login');
  {
    const r = await post('/auth/login', { email: EMAIL, password: PASSWORD });
    if (!r.ok) fail('Login', `HTTP ${r.status}: ${JSON.stringify(r.data)}`);
    jwtToken = r.data.token || r.data.accessToken || r.data.jwt;
    if (!jwtToken) fail('Login', `No token in response: ${JSON.stringify(r.data)}`);
    pass(`JWT obtained (${jwtToken.substring(0, 30)}...)`);
  }

  // ─── STEP 5: Get Current User (JWT Session) ───────────────────────────────
  console.log('\n[STEP 5] JWT Session Validation');
  {
    const r = await get('/auth/me', jwtToken);
    if (!r.ok) fail('JWT Session', `HTTP ${r.status}: ${JSON.stringify(r.data)}`);
    pass(`Session valid for user: ${JSON.stringify(r.data)}`);
  }

  // ─── STEP 6: Create Workspace ─────────────────────────────────────────────
  console.log('\n[STEP 6] Create Workspace');
  {
    const r = await post('/workspaces', {
      name: 'E2E Workspace ' + Date.now(),
      slug: 'e2e-workspace-' + Date.now(),
      timezone: 'UTC',
      locale: 'en-US',
      ownerId: userId,
      limits: {
        maxBusinesses: 5,
        maxConcurrentExecutions: 2,
        maxProxies: 10,
        maxVms: 3
      }
    }, jwtToken);
    if (!r.ok) fail('Create Workspace', `HTTP ${r.status}: ${JSON.stringify(r.data)}`);
    
    // Fetch workspace ID since creation endpoint returns void
    const listRes = await get('/workspaces', jwtToken);
    if (!listRes.ok || !listRes.data.length) fail('Get Workspaces', `Failed to list workspaces: ${JSON.stringify(listRes.data)}`);
    workspaceId = listRes.data[0].id;
    pass(`Workspace created: workspaceId=${workspaceId}`);
  }

  // ─── STEP 7: Create Business ──────────────────────────────────────────────
  console.log('\n[STEP 7] Create Business');
  {
    const r = await post(`/workspaces/${workspaceId}/businesses`, {
      name: 'E2E Business',
      category: 'Technology',
    }, jwtToken);
    if (!r.ok) fail('Create Business', `HTTP ${r.status}: ${JSON.stringify(r.data)}`);
    businessId = r.data.id || r.data.businessId;
    pass(`Business created: businessId=${businessId}`);
  }

  // ─── STEP 8: Campaign Creation ────────────────────────────────────────────
  console.log('\n[STEP 8] Campaign Creation');
  {
    const r = await post('/campaigns', {
      workspaceRef: workspaceId,
      name: 'E2E Test Campaign',
      description: 'Automated E2E validation campaign',
      priority: 'Medium',
      objective: 'BrandAwareness',
      strategy: 'Scheduled',
      tags: ['e2e', 'test'],
      budgetLimit: 100,
      budgetCurrency: 'USD',
      budgetType: 'DAILY'
    }, jwtToken);
    if (!r.ok) fail('Create Campaign', `HTTP ${r.status}: ${JSON.stringify(r.data)}`);
    campaignId = r.data.id || r.data.campaignId || (typeof r.data === 'string' ? r.data : undefined);
    if (!campaignId && r.data && r.data.id !== undefined) campaignId = r.data.id;
    pass(`Campaign created: ${JSON.stringify(r.data).substring(0, 100)}`);
  }

  // ─── STEP 9: Create Content ────────────────────────────────────────────────
  console.log('\n[STEP 9] Create Content');
  {
    const r = await post('/content', {
      workspaceRef: workspaceId,
      createdBy: userId,
      title: 'E2E Post Content',
      body: 'This is an end-to-end validated publication.'
    }, jwtToken);
    if (!r.ok) fail('Create Content', `HTTP ${r.status}: ${JSON.stringify(r.data)}`);
    contentId = r.data.id || r.data.contentId;
    pass(`Content created: contentId=${contentId}`);
  }

  // ─── STEP 10: Upload Media ──────────────────────────────────────────────────
  console.log('\n[STEP 10] Upload Media');
  {
    const r = await post('/assets', {
      workspaceRef: workspaceId,
      uploadedBy: userId,
      mediaCategory: 'IMAGE',
      mimeType: 'image/jpeg',
      fileSizeBytes: 10240,
      url: 'https://example.com/image.jpg'
    }, jwtToken);
    if (!r.ok) fail('Upload Media', `HTTP ${r.status}: ${JSON.stringify(r.data)}`);
    assetId = r.data.id || r.data.assetId;
    pass(`Media uploaded: assetId=${assetId}`);
  }

  // ─── STEP 11: Schedule Campaign ────────────────────────────────────────────
  console.log('\n[STEP 11] Schedule Campaign');
  {
    const r = await post(`/campaigns/${campaignId}/schedule`, {
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    }, jwtToken);
    if (!r.ok) fail('Schedule Campaign', `HTTP ${r.status}: ${JSON.stringify(r.data)}`);
    pass(`Campaign scheduled`);
  }

  // ─── STEP 12: Queue Publication ───────────────────────────────────────────
  console.log('\n[STEP 12] Queue Publication');
  {
    const r = await post(`/campaigns/${campaignId}/publications`, {
      contentId: contentId,
      format: 'STANDARD',
      publishAt: new Date(Date.now() + 60 * 1000).toISOString() // 1 minute from now
    }, jwtToken);
    if (!r.ok) fail('Queue Publication', `HTTP ${r.status}: ${JSON.stringify(r.data)}`);
    publicationId = r.data.id || r.data.publicationId;
    pass(`Publication queued: publicationId=${publicationId}`);
  }

  console.log('\n========================================');
  console.log('  ✓ E2E VALIDATION PASSED              ');
  console.log('========================================\n');
}

run().catch(err => {
  console.error('\n✗ UNEXPECTED ERROR:', err);
  process.exit(1);
});
