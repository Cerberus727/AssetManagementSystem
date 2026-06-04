import prisma from "../../config/prisma.js";

const deleteVendor = async (req, res) => {

    try {

        const { id } = req.params;

        const vendor = await prisma.vendor.findUnique({
            where: {
                vendor_id: id
            }
        });

        if (!vendor) {
            return res.status(404).json({
                success: false,
                message: "Vendor not found"
            });
        }

        await prisma.vendor.delete({
            where: {
                vendor_id: id
            }
        });

        return res.status(200).json({
            success: true,
            message: "Vendor deleted successfully"
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }

};

export default deleteVendor;