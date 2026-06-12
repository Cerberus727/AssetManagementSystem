import prisma from "../../config/prisma.js";

const getAllocations = async (req, res) => {
  try {
    const allocations = await prisma.assetAllocation.findMany({
      include: {
        asset: {
          select: {
            asset_tag: true,
            category: true,
            sub_category: true,
            manufacturer: true,
            model_number: true,
            status: true,
          },
        },
        employee: {
          select: {
            employee_id: true,
            first_name: true,
            last_name: true,
            email: true,
            department: true,
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
      orderBy: {
        allocated_at: "desc",
      },
    });

    return res.status(200).json({
      success: true,
      message: "Allocations retrieved successfully",
      count: allocations.length,
      allocations,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export default getAllocations;
