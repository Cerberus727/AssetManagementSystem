import prisma from "../../config/prisma.js";

const createAsset = async (req, res) => {
  try {
    const {
      asset_tag,
      model_number,
      serial_number,
      status,
      po_no,
      assigned_to,
      location_id,
    } = req.body;

    // 1. Validate required user-supplied fields
    if (!asset_tag || !model_number || !serial_number || !status || !po_no) {
      return res.status(400).json({
        success: false,
        message: "asset_tag, model_number, serial_number, status, and po_no are required",
      });
    }

    // 2. Validate PO exists
    const purchaseOrder = await prisma.purchaseOrder.findUnique({
      where: { po_no },
      include: {
        vendor: true,
        assets: { select: { asset_id: true } },
      },
    });

    if (!purchaseOrder) {
      return res.status(404).json({
        success: false,
        message: `Purchase Order "${po_no}" not found`,
      });
    }

    // 3. Inventory check — available_qty = ordered_qty - assets already created
    const assetsCreated = purchaseOrder.assets.length;
    const availableQty = purchaseOrder.ordered_qty - assetsCreated;

    if (availableQty <= 0) {
      return res.status(400).json({
        success: false,
        message: `No inventory available for PO "${po_no}". Ordered: ${purchaseOrder.ordered_qty}, Created: ${assetsCreated}`,
      });
    }

    // 4. Unique asset tag check
    const existingTag = await prisma.asset.findUnique({ where: { asset_tag } });
    if (existingTag) {
      return res.status(400).json({
        success: false,
        message: "Asset tag already exists",
      });
    }

    // 5. Unique serial number check
    const existingSerial = await prisma.asset.findFirst({ where: { serial_number } });
    if (existingSerial) {
      return res.status(400).json({
        success: false,
        message: "Serial number already exists",
      });
    }

    // 6. Validate employee if provided
    if (assigned_to) {
      const employee = await prisma.employee.findUnique({
        where: { employee_id: assigned_to },
      });
      if (!employee) {
        return res.status(404).json({
          success: false,
          message: "Assigned employee not found",
        });
      }
    }

    // 7. Validate location if provided
    if (location_id) {
      const location = await prisma.location.findUnique({
        where: { location_id },
      });
      if (!location) {
        return res.status(404).json({
          success: false,
          message: "Location not found",
        });
      }
    }

    // 8. Auto-populate fields from PO (users cannot override these)
    const category = purchaseOrder.category;
    const sub_category = purchaseOrder.sub_category;
    const manufacturer = purchaseOrder.vendor.company_name; // Vendor → manufacturer
    const purchase_date = purchaseOrder.capitalized_date;
    const warranty_expiry = purchaseOrder.warranty_expiry;
    const purchase_cost = purchaseOrder.unit_cost;

    // 9. Execute in a transaction: create asset + optionally create allocation
    const result = await prisma.$transaction(async (tx) => {
      const asset = await tx.asset.create({
        data: {
          asset_tag,
          category,
          sub_category,
          manufacturer,
          model_number,
          serial_number,
          status,
          po_no,
          assigned_to: assigned_to || null,
          location_id: location_id || null,
          purchase_date,
          warranty_expiry,
          purchase_cost,
        },
        include: {
          employee: true,
          location: true,
          purchaseOrder: { include: { vendor: true } },
        },
      });

      // Create allocation record if both employee and location are provided
      let allocation = null;
      if (assigned_to && location_id) {
        allocation = await tx.assetAllocation.create({
          data: {
            asset_id: asset.asset_id,
            employee_id: assigned_to,
            location_id,
          },
        });
      }

      return { asset, allocation };
    });

    return res.status(201).json({
      success: true,
      message: "Asset created successfully",
      asset: result.asset,
      allocation: result.allocation,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export default createAsset;