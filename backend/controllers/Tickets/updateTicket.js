import prisma from "../../config/prisma.js";

const updateTicket = async (req, res) => {

    try {

        const { id } = req.params;

        const {
            ticket_type,
            issue_description,
            resolved_date,
            cost
        } = req.body;

        const existingTicket = await prisma.ticket.findUnique({
            where: {
                ticket_id: id
            }
        });

        if (!existingTicket) {
            return res.status(404).json({
                success: false,
                message: "Ticket not found"
            });
        }

       

        if (cost !== undefined && cost < 0) {
            return res.status(400).json({
                success: false,
                message: "Cost cannot be negative"
            });
        }

        const updatedTicket = await prisma.ticket.update({

            where: {
                ticket_id: id
            },

            data: {
                ticket_type: ticket_type?.trim(),
                issue_description: issue_description?.trim(),
                resolved_date: resolved_date
                    ? new Date(resolved_date)
                    : undefined,
                cost: cost !== undefined
                    ? Number(cost)
                    : undefined
            }

        });

        return res.status(200).json({
            success: true,
            message: "Ticket updated successfully",
            ticket: updatedTicket
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }

};

export default updateTicket;