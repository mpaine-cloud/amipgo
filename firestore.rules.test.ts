import { assertFails, assertSucceeds, initializeTestEnvironment, RulesTestEnvironment } from '@firebase/rules-unit-testing';
import * as fs from 'fs';
import { describe, it, beforeAll, afterAll, beforeEach } from 'vitest';

let testEnv: RulesTestEnvironment;

beforeAll(async () => {
  testEnv = await initializeTestEnvironment({
    projectId: 'demo-test',
    firestore: {
      rules: fs.readFileSync('DRAFT_firestore.rules', 'utf8'),
    },
  });
});

beforeEach(async () => {
  await testEnv.clearFirestore();
});

afterAll(async () => {
  await testEnv.cleanup();
});

describe('Blog Rules', () => {
  it('should prevent unauthenticated reading of unpublished posts', async () => {
    const unauthedDb = testEnv.unauthenticatedContext().firestore();
    
    // Setup a draft post as an admin
    await testEnv.withSecurityRulesDisabled(async (context) => {
      await context.firestore().doc('posts/draft').set({ published: false });
    });

    await assertFails(unauthedDb.collection('posts').doc('draft').get());
  });
});
