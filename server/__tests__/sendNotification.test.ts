import request from 'supertest';

const baseUrl = 'http://localhost:5000';

describe('POST /send-notification', () => {
  it('should send a valid notification and return updated notifications', async () => {
    const res = await request(baseUrl)
      .post('/send-notification')
      .send({
        type: 'info',
        event: 'Test Event',
        message: 'Test notification',
        status: 'unread',
      });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.notifications)).toBe(true);
  });
});
