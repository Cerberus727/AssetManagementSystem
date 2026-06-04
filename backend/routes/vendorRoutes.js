import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";

import createVendor from "../controllers/Vendors/createVendor.js";
import updateVendor from "../controllers/Vendors/updateVendor.js";
import deleteVendor from "../controllers/Vendors/deleteVendor.js";
import getVendors from "../controllers/Vendors/getVendors.js";
import getVendorById from "../controllers/Vendors/getVendorById.js";
const router = express.Router();

router.use(authMiddleware);

router.post("/", createVendor);
router.put("/:id", updateVendor);
router.delete("/:id", deleteVendor);
router.get("/", getVendors);
router.get("/:id", getVendorById);
export default router;