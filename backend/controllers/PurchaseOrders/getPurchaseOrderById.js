import prisma from "../../config/prisma.js";

const getPurchaseOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    const po = await prisma.purchaseOrder.findUnique({
      where: { po_no: id },
      include: {
        vendor: true,
        assets: {
          include: {
            employee: true,
            location: true,
          },
        },
      },
    });

    if (!po) {
      return res.status(404).json({
        success: false,
        message: "Purchase Order not found",
      });
    }

    const enriched = {
      ...po,
      assets_created: po.assets.length,
      available_qty: po.ordered_qty - po.assets.length,
    };

    return res.status(200).json({
      success: true,
      message: "Purchase Order retrieved successfully",
      purchaseOrder: enriched,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export default getPurchaseOrderById;
