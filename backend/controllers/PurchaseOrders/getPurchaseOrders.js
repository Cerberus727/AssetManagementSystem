import prisma from "../../config/prisma.js";

const getPurchaseOrders = async (req, res) => {
  try {
    const purchaseOrders = await prisma.purchaseOrder.findMany({
      include: {
        vendor: true,
        assets: true,
      },
      orderBy: {
        po_no: "asc",
      },
    });

    // Compute inventory metrics for each PO
    const enriched = purchaseOrders.map((po) => ({
      ...po,
      assets_created: po.assets.length,
      available_qty: po.ordered_qty - po.assets.length,
    }));

    return res.status(200).json({
      success: true,
      message: "Purchase Orders retrieved successfully",
      count: enriched.length,
      purchaseOrders: enriched,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export default getPurchaseOrders;
