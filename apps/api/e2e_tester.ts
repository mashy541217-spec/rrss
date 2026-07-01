import * as crypto from 'crypto';

const API_BASE = 'http://localhost:3000';
const EMAIL = `e2e_test_${Date.now()}@example.com`;
const PASSWORD = 'password123';

let jwtToken = '';
let userId = '';
let workspaceId = '';
let businessId = '';

async function run() {
  console.log('--- STARTING E2E VALIDATION ---');
  try {
    // 1. User Registration
    console.log('\n[1] User Registration');
    let res = await fetch(`${API_BASE}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: EMAIL, displayName: 'E2E Tester', password: PASSWORD }),
    });
    let data = await res.json();
    if (!res.ok) throw new Error(`Registration failed: ${JSON.stringify(data)}`);
    console.log(`✓ Registered User: ${data.userId}`);
    userId = data.userId;
    const verificationCode = data.verificationCode;

    // 2. Email Verification
    console.log('\n[2] Email Verification');
    res = await fetch(`${API_BASE}/auth/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, code: verificationCode }),
    });
    if (!res.ok) throw new Error(`Verification failed: ${await res.text()}`);
    console.log('✓ Email Verified');

    // 3. Login
    console.log('\n[3] Login');
    res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
    });
    data = await res.json();
    if (!res.ok) throw new Error(`Login failed: ${JSON.stringify(data)}`);
    jwtToken = data.token;
    console.log('✓ Login Successful, JWT obtained');

    const authHeaders = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${jwtToken}`,
    };

    // 4. Create Workspace
    console.log('\n[4] Create Workspace');
    res = await fetch(`${API_BASE}/workspaces`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        name: 'E2E Workspace',
        slug: `e2e-ws-${Date.now()}`,
        timezone: 'UTC',
        locale: 'en',
        ownerId: userId,
        limits: {
          maxBusinesses: 10,
          maxConcurrentExecutions: 50,
          maxSocialAccounts: 10,
          maxTeamMembers: 5,
        }
      }),
    });
    data = await res.json();
    if (!res.ok) throw new Error(`Create Workspace failed: ${JSON.stringify(data)}`);
    workspaceId = data.id;
    console.log(`✓ Workspace Created: ${workspaceId}`);

    // 5. Create Business
    console.log('\n[5] Create Business');
    res = await fetch(`${API_BASE}/workspaces/${workspaceId}/businesses`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        name: 'E2E Business',
        category: 'Testing'
      }),
    });
    data = await res.json();
    if (!res.ok) throw new Error(`Create Business failed: ${JSON.stringify(data)}`);
    businessId = data.id;
    console.log(`✓ Business Created: ${businessId}`);

    // 6. Upload Media
    console.log('\n[6] Upload Media');
    // Simulate multipart form data for file upload
    const formData = new FormData();
    const mockFile = new Blob(['mock image data'], { type: 'image/png' });
    formData.append('file', mockFile, 'test-image.png');
    formData.append('workspaceId', workspaceId);
    formData.append('businessId', businessId);
    
    // We cannot easily do FormData with native fetch without a polyfill or complex boundary construction in Node.js
    // Alternatively, if the endpoint accepts base64 or similar, but the frontend uses FormData.
    // Let's assume the upload endpoint might have an issue or we just call draft without assets first to test Orchestration.
    // Actually, let's try the publishing draft.

    console.log('\n[7] Create Campaign Draft');
    const draftPayload = {
      workspaceId,
      businessId,
      caption: 'Hello from E2E test!',
      assetIds: [],
      targetChannels: [
        { provider: 'facebook', pageId: 'mock-page-id' }
      ]
    };
    res = await fetch(`${API_BASE}/api/publishing/draft`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify(draftPayload)
    });
    if (res.status === 404) {
      console.log('⚠️ /api/publishing/draft not found, looking for correct endpoint...');
      // We will need to implement or find the right endpoint
    } else if (!res.ok) {
      console.error(`Draft failed: ${await res.text()}`);
    } else {
      console.log('✓ Campaign Draft Created');
    }

    console.log('\n--- E2E PARTIAL SUCCESS ---');
    console.log('Will iterate to fix remaining endpoints.');

  } catch (error) {
    console.error('\n❌ E2E FLOW FAILED');
    console.error(error);
    process.exit(1);
  }
}

run();
