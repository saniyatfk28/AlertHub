import express from "express";
import { createSos } from "../Controllers/sosController.js";

const router = express.Router();

router.post("/", createSos);

export default router;
import express from "express";
import { createSos } from "../Controllers/sosController.js";

const router = express.Router();

router.post("/", createSos);

export default router;
