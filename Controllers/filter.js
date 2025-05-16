import express from 'express';
const router = express.Router();
import * as incidentModel from '../Models/incident.js';

// Removed connectDB call to avoid duplicate DB connection

router.get('/search', async (req, res) => {
  const location = req.query.location;
  try {
    const incidents = await incidentModel.findIncidentsByLocation(location);
    res.json(incidents);
  } catch (error) {
    console.error('Error fetching incidents:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
