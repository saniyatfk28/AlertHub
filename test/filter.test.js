import request from 'supertest';
import express from 'express';
import filterRouter from '../Controllers/filter.js';
import * as incidentModel from '../Models/incident.js';

// Create Express app and use filter router
const app = express();
app.use('/', filterRouter);

// Mock data
const mockIncidents = [
  { id: 1, title: 'Fire', location: 'Dhaka' },
  { id: 2, title: 'Flood', location: 'Chittagong' },
];

describe('GET /search?location=', () => {
  //  Test 1 - Should return incidents from Dhaka
  it('should return filtered incidents for location Dhaka', async () => {
    jest.spyOn(incidentModel, 'findIncidentsByLocation').mockResolvedValue([
      mockIncidents[0],
    ]);

    const response = await request(app).get('/search?location=Dhaka');
    expect(response.statusCode).toBe(200);
    expect(response.body.length).toBe(1);
    expect(response.body[0].location).toBe('Dhaka');
  });

  // Test 2 - Should return empty array for unknown location
  it('should return empty array if no incidents found for location', async () => {
    jest.spyOn(incidentModel, 'findIncidentsByLocation').mockResolvedValue([]);

    const response = await request(app).get('/search?location=NoCity');
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual([]);
  });

  // Test 3 - Fail if expecting wrong count
  it('should fail when expecting wrong number of incidents', async () => {
    jest.spyOn(incidentModel, 'findIncidentsByLocation').mockResolvedValue([
      mockIncidents[0],
    ]);

    const response = await request(app).get('/search?location=Dhaka');
    // Wrong expectation, this test will fail
    expect(response.body.length).toBe(2);
  });
});
