import express from "express";
import { createInteraction, deleteInteraction, getInteraction, getTimelineInteractions, likeInteraction, updateInteraction, getAllInteractions } from "../Controllers/InteractionController.js";
const router = express.Router();

router.post('/', createInteraction);
router.get('/', getAllInteractions);
router.get('/:id', getInteraction);
router.put('/:id', updateInteraction);
router.delete('/:id', deleteInteraction);
router.put('/:id/like', likeInteraction);
router.get('/:id/timeline', getTimelineInteractions);

export default router;
