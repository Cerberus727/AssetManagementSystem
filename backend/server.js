import express from 'express';
import cors from 'cors';
import dotenv from "dotenv";
import prisma from "./config/prisma.js";
import authRoutes from "./routes/authRoutes.js";
import assetRoutes from "./routes/assetRoutes.js";
import employeeRoutes from "./routes/employeeRoutes.js";
import locationRoutes from "./routes/locationRoutes.js";
import vendorRoutes from "./routes/vendorRoutes.js";
import ticketRoutes from "./routes/ticketRoutes.js";
import purchaseOrderRoutes from "./routes/purchaseOrderRoutes.js";
import assetAllocationRoutes from "./routes/assetAllocationRoutes.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/assets", assetRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/locations", locationRoutes);
app.use("/api/vendors", vendorRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/purchase-orders", purchaseOrderRoutes);
app.use("/api/asset-allocations", assetAllocationRoutes);

app.get("/", async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json({
      success: true,
      users,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});