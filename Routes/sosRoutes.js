import express from "express";
import { createSos, getAllSosCalls, updateSosCallStatus } from "../Controllers/sosController.js";

const router = express.Router();

router.post("/", createSos);
router.get("/admin", getAllSosCalls);
router.patch("/admin/:id", updateSosCallStatus);

export default router;
