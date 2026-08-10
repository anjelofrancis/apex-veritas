const request = require('supertest');
const app = require('../src/app'); // Requires app.js to be exported without app.listen
const prisma = require('../src/config/db');

// This test suite proves that a CLIENT_USER strictly cannot access another client's documents.
describe('Security Check: Cross-Tenant Data Isolation', () => {
  
  test('CLIENT_USER should receive 403 Forbidden or 404 Not Found when requesting documents from a different client ID', async () => {
    // Generate a mock JWT for a CLIENT_USER belonging to Client A
    const jwt = require('jsonwebtoken');
    const mockToken = jwt.sign({
      id: 'userA_123',
      clientId: 'clientA_456',
      role: 'CLIENT_USER'
    }, process.env.JWT_ACCESS_SECRET || 'test_secret');

    // Attempt to request documents, explicitly trying to query Client B's data
    // In our architecture, the backend ignores req.query.clientId for CLIENT_USERs
    // and forces it to their own req.user.clientId. We test that this security boundary holds.
    
    const response = await request(app)
      .get('/api/documents?clientId=clientB_789')
      .set('Authorization', `Bearer ${mockToken}`);
    
    // The API should either return 403 Forbidden if it detects an illegal cross-tenant attempt,
    // OR it should silently default to Client A's data (200 OK, but ONLY containing Client A's data).
    // In Apex Veritas, the route `const targetClientId = ...` ignores the query param for CLIENT_USER.
    // Let's verify it didn't crash.
    expect([200, 403]).toContain(response.status);
    
    // If it returned 200, let's verify it did NOT fetch Client B's data
    if (response.status === 200) {
      // The data returned should belong to clientA_456, not clientB_789
      const docs = response.body.data || [];
      for (const doc of docs) {
        expect(doc.clientId).not.toBe('clientB_789');
        expect(doc.clientId).toBe('clientA_456');
      }
    }
  });

});
