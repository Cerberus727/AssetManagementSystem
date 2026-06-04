import prisma from "../../config/prisma.js";

const getLocationById = async (req, res) => {

    try {

        const { id } = req.params;

        const location = await prisma.location.findUnique({

            where: {
                location_id: id
            },

            include: {
                assets: true
            }

        });

        if (!location) {
            return res.status(404).json({
                success: false,
                message: "Location not found"
            });
        }

        return res.status(200).json({
            success: true,
            location
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }

};

export default getLocationById;