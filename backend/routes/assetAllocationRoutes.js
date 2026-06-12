import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import getAllocations from "../controllers/AssetAllocations/getAllocations.js";
import getAllocationById from "../controllers/AssetAllocations/getAllocationById.js";

const router = express.Router();

// Read-only routes — no POST/PUT/DELETE (allocations are audit records only)
router.get("/", authMiddleware, getAllocations);
router.get("/:id", authMiddleware, getAllocationById);

export default router;
