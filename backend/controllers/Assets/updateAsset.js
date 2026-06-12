import prisma from "../../config/prisma.js";

const updateAsset = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      asset_tag,
      model_number,
      serial_number,
      status,
      assigned_to,
      location_id,
    } = req.body;

    // Fetch existing asset
    const existingAsset = await prisma.asset.findUnique({
      where: { asset_id: id },
    });

    if (!existingAsset) {
      return res.status(404).json({
        success: false,
        message: "Asset not found",
      });
    }

    // Validate asset_tag uniqueness (exclude self)
    if (asset_tag) {
      const tagConflict = await prisma.asset.findFirst({
        where: {
          asset_tag,
          NOT: { asset_id: id },
        },
      });
      if (tagConflict) {
        return res.status(400).json({
          success: false,
          message: "Asset tag already exists",
        });
      }
    }

    // Validate serial_number uniqueness (exclude self)
    if (serial_number) {
      const serialConflict = await prisma.asset.findFirst({
        where: {
          serial_number,
          NOT: { asset_id: id },
        },
      });
      if (serialConflict) {
        return res.status(400).json({
          success: false,
          message: "Serial number already exists",
        });
      }
    }

    // Validate employee if changing
    if (assigned_to !== undefined && assigned_to !== null && assigned_to !== "") {
      const employee = await prisma.employee.findUnique({
        where: { employee_id: assigned_to },
      });
      if (!employee) {
        return res.status(404).json({
          success: false,
          message: "Employee not found",
        });
      }
    }

    // Validate location if changing
    if (location_id !== undefined && location_id !== null && location_id !== "") {
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

    // Detect if employee or location changed — triggers new allocation row
    const employeeChanged =
      assigned_to !== undefined &&
      assigned_to !== existingAsset.assigned_to;
    const locationChanged =
      location_id !== undefined &&
      location_id !== existingAsset.location_id;

    const needsAllocationRecord = (employeeChanged || locationChanged);

    // Determine final employee and location for the allocation row
    const finalEmployee = assigned_to !== undefined
      ? (assigned_to || null)
      : existingAsset.assigned_to;
    const finalLocation = location_id !== undefined
      ? (location_id || null)
      : existingAsset.location_id;

    // Execute in a transaction: update asset + optionally append allocation
    const result = await prisma.$transaction(async (tx) => {
      const updatedAsset = await tx.asset.update({
        where: { asset_id: id },
        data: {
          asset_tag,
          model_number,
          serial_number,
          status,
          assigned_to: assigned_to !== undefined ? (assigned_to || null) : undefined,
          location_id: location_id !== undefined ? (location_id || null) : undefined,
          // PO-derived fields (category, manufacturer, etc.) are NOT updated manually
        },
        include: {
          employee: true,
          location: true,
          purchaseOrder: { include: { vendor: true } },
        },
      });

      // Create new allocation if employee or location changed and both are present
      let allocation = null;
      if (needsAllocationRecord && finalEmployee && finalLocation) {
        allocation = await tx.assetAllocation.create({
          data: {
            asset_id: id,
            employee_id: finalEmployee,
            location_id: finalLocation,
          },
        });
      }

      return { updatedAsset, allocation };
    });

    return res.status(200).json({
      success: true,
      message: "Asset updated successfully",
      asset: result.updatedAsset,
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

export default updateAsset;