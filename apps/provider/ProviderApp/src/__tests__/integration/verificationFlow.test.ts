"use strict";
import { store } from '../../store';
import { uploadVerificationDocument, fetchVerificationStatus } from '../../features/verification/verificationSlice';
import { loginUser } from '../../features/auth/authSlice';
import { mockWorker } from '../../services/mock';

beforeAll(() => {
  mockWorker.start();
});

afterEach(() => {
  jest.clearAllMocks();
});

afterAll(() => {
  mockWorker.stop();
});

describe('Verification Flow Integration', () => {
  beforeEach(async () => {
    await store.dispatch(loginUser('test@example.com', 'password'));
  });

  it('should upload a document and fetch verification status', async () => {
    const file = new File([''], 'test.png', { type: 'image/png' });
    await store.dispatch(uploadVerificationDocument('id', file));

    await store.dispatch(fetchVerificationStatus());
    const state = store.getState();
    expect(state.verification.status).toBe('pending');
    expect(state.verification.documents).toContainEqual(
      expect.objectContaining({
        type: 'id',
        status: 'pending',
      })
    );
  });
});