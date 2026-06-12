import prisma from "../../config/prisma.js";

const updatePurchaseOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      description,
      capitalized_date,
      ordered_qty,
      unit_cost,
      category,
      sub_category,
      vendor_id,
      warranty_expiry,
    } = req.body;

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

    // Cannot reduce ordered_qty below already-created assets
    if (ordered_qty !== undefined) {
      if (ordered_qty <= 0) {
        return res.status(400).json({
          success: false,
          message: "Ordered quantity must be greater than 0",
        });
      }
      if (ordered_qty < existing.assets.length) {
        return res.status(400).json({
          success: false,
          message: `Cannot reduce quantity below ${existing.assets.length} (assets already created from this PO)`,
        });
      }
    }

    if (unit_cost !== undefined && unit_cost < 0) {
      return res.status(400).json({
        success: false,
        message: "Unit cost cannot be negative",
      });
    }

    if (vendor_id) {
      const vendor = await prisma.vendor.findUnique({ where: { vendor_id } });
      if (!vendor) {
        return res.status(404).json({
          success: false,
          message: "Vendor not found",
        });
      }
    }

    const updated = await prisma.purchaseOrder.update({
      where: { po_no: id },
      data: {
        description,
        capitalized_date: capitalized_date ? new Date(capitalized_date) : undefined,
        ordered_qty: ordered_qty !== undefined ? parseInt(ordered_qty) : undefined,
        unit_cost: unit_cost !== undefined ? parseFloat(unit_cost) : undefined,
        category,
        sub_category,
        vendor_id,
        warranty_expiry: warranty_expiry ? new Date(warranty_expiry) : undefined,
      },
      include: { vendor: true },
    });

    return res.status(200).json({
      success: true,
      message: "Purchase Order updated successfully",
      purchaseOrder: updated,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export default updatePurchaseOrder;
