import prisma from "../../config/prisma.js";

const updateVendor = async (req, res) => {

    try {

        const { id } = req.params;

        const {
            company_name,
            contact_name,
            contact_email,
            contact_phone,
            support_portal
        } = req.body;

        const existingVendor = await prisma.vendor.findUnique({
            where: {
                vendor_id: id
            }
        });

        if (!existingVendor) {
            return res.status(404).json({
                success: false,
                message: "Vendor not found"
            });
        }

        

        if (contact_email) {

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!emailRegex.test(contact_email)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid email format"
                });
            }

            const duplicateEmail = await prisma.vendor.findFirst({
                where: {
                    contact_email: contact_email.trim(),
                    NOT: {
                        vendor_id: id
                    }
                }
            });

            if (duplicateEmail) {
                return res.status(400).json({
                    success: false,
                    message: "Vendor email already exists"
                });
            }
        }

        const updatedVendor = await prisma.vendor.update({

            where: {
                vendor_id: id
            },

            data: {
                company_name: company_name?.trim(),
                contact_name: contact_name?.trim(),
                contact_email: contact_email?.trim(),
                contact_phone: contact_phone?.trim(),
                support_portal: support_portal?.trim()
            }

        });

        return res.status(200).json({
            success: true,
            message: "Vendor updated successfully",
            vendor: updatedVendor
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }

};

export default updateVendor;