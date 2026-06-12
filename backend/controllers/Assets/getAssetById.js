import prisma from "../../config/prisma.js";

const getAssetById = async (req, res) => {
  try {
    const { id } = req.params;

    const asset = await prisma.asset.findUnique({
      where: { asset_id: id },
      include: {
        employee: true,
        location: true,
        tickets: true,
        purchaseOrder: {
          include: { vendor: true },
        },
        allocations: {
          include: {
            employee: {
              select: {
                employee_id: true,
                first_name: true,
                last_name: true,
                email: true,
              },
            },
            location: {
              select: {
                location_id: true,
                building_name: true,
                floor: true,
                room_number: true,
              },
            },
          },
          orderBy: { allocated_at: "desc" },
        },
      },
    });

    if (!asset) {
      return res.status(404).json({
        success: false,
        message: "Asset not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Asset retrieved successfully",
      asset,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export default getAssetById;