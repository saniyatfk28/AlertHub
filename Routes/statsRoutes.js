// Routes/statsRoutes.js
import express from 'express';
import { getCrimeStats, getMonthlyCrimeStats } from '../Controllers/crimeStatsController.js';

const router = express.Router();
router.get('/crime-stats', getCrimeStats);
router.get('/monthly-crime-stats', getMonthlyCrimeStats);

export default router;
