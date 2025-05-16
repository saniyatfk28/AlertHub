import request from 'supertest';
import express from 'express';
import InteractionRoute from '../Routes/InteractionRoute.js';
import bodyParser from 'body-parser';

const app = express();
app.use(bodyParser.json());
app.use('/interactions', InteractionRoute);

describe('Interactions API Endpoints', () => {
  let createdInteractionId;

  it('should create a new interaction', async () => {
    const res = await request(app)
      .post('/interactions')
      .send({
        userId: 'testuser',
        title: 'Test Interaction',
        details: 'This is a test interaction',
        category: 'Test',
        location: 'Test Location',
        status: 1,
        image: 'test.jpg',
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual('Interaction created!');
  });

  it('should get all interactions', async () => {
    const res = await request(app).get('/interactions');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
    if (res.body.length > 0) {
      createdInteractionId = res.body[0]._id;
    }
  });

  it('should get an interaction by id', async () => {
    if (!createdInteractionId) return;
    const res = await request(app).get(`/interactions/${createdInteractionId}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('_id', createdInteractionId);
  });

  it('should update an interaction', async () => {
    if (!createdInteractionId) return;
    const res = await request(app)
      .put(`/interactions/${createdInteractionId}`)
      .send({
        userId: 'testuser',
        title: 'Updated Interaction',
      });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual('Interaction Updated');
  });

  it('should like an interaction', async () => {
    if (!createdInteractionId) return;
    const res = await request(app)
      .put(`/interactions/${createdInteractionId}/like`)
      .send({ userId: 'testuser' });
    expect(res.statusCode).toEqual(200);
    expect(['Interaction liked', 'Interaction unliked']).toContain(res.body);
  });

  it('should delete an interaction', async () => {
    if (!createdInteractionId) return;
    const res = await request(app)
      .delete(`/interactions/${createdInteractionId}`)
      .send({ userId: 'testuser' });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual('Interaction deleted successfully');
  });
});
