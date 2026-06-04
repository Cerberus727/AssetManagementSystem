import prisma from "../../config/prisma.js";

const createTicket = async (req, res) => {

    try {

        const {
            asset_id,
            ticket_type,
            issue_description,
            opened_date,
            resolved_date,
            cost
        } = req.body;

      

        if (
            !asset_id ||
            !ticket_type ||
            !issue_description ||
            !opened_date ||
            cost === undefined
        ) {
            return res.status(400).json({
                success: false,
                message: "Please provide all required fields"
            });
        }

        

        if (
            asset_id.trim() === "" ||
            ticket_type.trim() === "" ||
            issue_description.trim() === ""
        ) {
            return res.status(400).json({
                success: false,
                message: "Fields cannot be empty"
            });
        }


        if (cost < 0) {
            return res.status(400).json({
                success: false,
                message: "Cost cannot be negative"
            });
        }


        const asset = await prisma.asset.findUnique({
            where: {
                asset_id: asset_id.trim()
            }
        });

        if (!asset) {
            return res.status(404).json({
                success: false,
                message: "Asset not found"
            });
        }

        const ticket = await prisma.ticket.create({

            data: {
                asset_id: asset_id.trim(),
                ticket_type: ticket_type.trim(),
                issue_description: issue_description.trim(),
                opened_date: new Date(opened_date),
                resolved_date: resolved_date
                    ? new Date(resolved_date)
                    : null,
                cost: Number(cost)
            }

        });

        return res.status(201).json({
            success: true,
            message: "Ticket created successfully",
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

export default createTicket;