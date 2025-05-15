// Routes/statsRoutes.js
import express from 'express';
import { getCrimeStats, getMonthlyCrimeStats, getTopCrimeStats } from '../Controllers/crimeStatsController.js';

const router = express.Router();
router.get('/crime-stats', getCrimeStats);
router.get('/monthly-crime-stats', getMonthlyCrimeStats);
router.get('/top-crime-stats', getTopCrimeStats);

export default router;
