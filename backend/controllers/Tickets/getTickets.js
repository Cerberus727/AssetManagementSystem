import prisma from "../../config/prisma.js";

const getTickets = async (req, res) => {

    try {

        const tickets = await prisma.ticket.findMany({

            include: {
                asset: true
            }

        });

        return res.status(200).json({
            success: true,
            count: tickets.length,
            tickets
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }

};

export default getTickets;