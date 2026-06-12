import prisma from "../../config/prisma.js";

const getAllocationById = async (req, res) => {
  try {
    const { id } = req.params;

    const allocation = await prisma.assetAllocation.findUnique({
      where: { allocation_id: id },
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
    });

    if (!allocation) {
      return res.status(404).json({
        success: false,
        message: "Allocation not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Allocation retrieved successfully",
      allocation,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export default getAllocationById;
