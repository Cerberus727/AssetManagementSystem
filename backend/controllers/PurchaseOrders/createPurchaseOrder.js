import prisma from "../../config/prisma.js";

const createPurchaseOrder = async (req, res) => {
  try {
    const {
      po_no,
      description,
      capitalized_date,
      ordered_qty,
      unit_cost,
      category,
      sub_category,
      vendor_id,
      warranty_expiry,
    } = req.body;

    // Required field validation
    if (
      !po_no ||
      !description ||
      !capitalized_date ||
      ordered_qty === undefined ||
      unit_cost === undefined ||
      !category ||
      !sub_category ||
      !vendor_id ||
      !warranty_expiry
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Business rule validations
    if (ordered_qty <= 0) {
      return res.status(400).json({
        success: false,
        message: "Ordered quantity must be greater than 0",
      });
    }

    if (unit_cost < 0) {
      return res.status(400).json({
        success: false,
        message: "Unit cost cannot be negative",
      });
    }

    // PO number uniqueness
    const existing = await prisma.purchaseOrder.findUnique({
      where: { po_no },
    });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Purchase Order number already exists",
      });
    }

    // Vendor existence
    const vendor = await prisma.vendor.findUnique({
      where: { vendor_id },
    });
    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found",
      });
    }

    const purchaseOrder = await prisma.purchaseOrder.create({
      data: {
        po_no,
        description,
        capitalized_date: new Date(capitalized_date),
        ordered_qty: parseInt(ordered_qty),
        unit_cost: parseFloat(unit_cost),
        category,
        sub_category,
        vendor_id,
        warranty_expiry: new Date(warranty_expiry),
      },
      include: {
        vendor: true,
      },
    });

    return res.status(201).json({
      success: true,
      message: "Purchase Order created successfully",
      purchaseOrder,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export default createPurchaseOrder;
