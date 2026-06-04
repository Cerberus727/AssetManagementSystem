import prisma from "../../config/prisma.js";

const getTicketById = async (req, res) => {

    try {

        const { id } = req.params;

        const ticket = await prisma.ticket.findUnique({

            where: {
                ticket_id: id
            },

            include: {
                asset: true
            }

        });

        if (!ticket) {
            return res.status(404).json({
                success: false,
                message: "Ticket not found"
            });
        }

        return res.status(200).json({
            success: true,
            ticket
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }

};

export default getTicketById;