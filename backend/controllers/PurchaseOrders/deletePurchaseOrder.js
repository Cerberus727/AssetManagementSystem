import prisma from "../../config/prisma.js";

const deletePurchaseOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await prisma.purchaseOrder.findUnique({
      where: { po_no: id },
      include: { assets: true },
    });

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Purchase Order not found",
      });
    }

    // Prevent deletion if assets have been created from this PO
    if (existing.assets.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Cannot delete Purchase Order with ${existing.assets.length} asset(s) linked to it. Remove or re-assign assets first.`,
      });
    }

    await prisma.purchaseOrder.delete({
      where: { po_no: id },
    });

    return res.status(200).json({
      success: true,
      message: "Purchase Order deleted successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export default deletePurchaseOrder;
