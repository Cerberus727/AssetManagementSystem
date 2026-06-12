import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import createPurchaseOrder from "../controllers/PurchaseOrders/createPurchaseOrder.js";
import getPurchaseOrders from "../controllers/PurchaseOrders/getPurchaseOrders.js";
import getPurchaseOrderById from "../controllers/PurchaseOrders/getPurchaseOrderById.js";
import updatePurchaseOrder from "../controllers/PurchaseOrders/updatePurchaseOrder.js";
import deletePurchaseOrder from "../controllers/PurchaseOrders/deletePurchaseOrder.js";

const router = express.Router();

router.get("/", authMiddleware, getPurchaseOrders);
router.get("/:id", authMiddleware, getPurchaseOrderById);
router.post("/", authMiddleware, createPurchaseOrder);
router.put("/:id", authMiddleware, updatePurchaseOrder);
router.delete("/:id", authMiddleware, deletePurchaseOrder);

export default router;
