import prisma from "../../config/prisma.js";

const getVendors = async (req, res) => {

    try {

        const vendors = await prisma.vendor.findMany();

        return res.status(200).json({
            success: true,
            count: vendors.length,
            vendors
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }

};

export default getVendors;