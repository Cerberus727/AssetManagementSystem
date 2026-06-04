import prisma from "../../config/prisma.js";

const deleteTicket = async (req, res) => {

    try {

        const { id } = req.params;

        const ticket = await prisma.ticket.findUnique({
            where: {
                ticket_id: id
            }
        });

        if (!ticket) {
            return res.status(404).json({
                success: false,
                message: "Ticket not found"
            });
        }

        await prisma.ticket.delete({
            where: {
                ticket_id: id
            }
        });

        return res.status(200).json({
            success: true,
            message: "Ticket deleted successfully"
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }

};

export default deleteTicket;