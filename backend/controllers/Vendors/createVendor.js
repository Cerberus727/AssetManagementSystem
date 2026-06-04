import prisma from "../../config/prisma.js";

const createVendor = async (req, res) => {

    try {

        const {
            company_name,
            contact_name,
            contact_email,
            contact_phone,
            support_portal
        } = req.body;

       

        if (
            !company_name ||
            !contact_name ||
            !contact_email ||
            !contact_phone
        ) {
            return res.status(400).json({
                success: false,
                message: "Please provide all required fields"
            });
        }

       
        if (
            company_name.trim() === "" ||
            contact_name.trim() === "" ||
            contact_email.trim() === "" ||
            contact_phone.trim() === ""
        ) {
            return res.status(400).json({
                success: false,
                message: "Fields cannot be empty"
            });
        }

    

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(contact_email)) {
            return res.status(400).json({
                success: false,
                message: "Invalid email format"
            });
        }

     
        const existingVendor = await prisma.vendor.findUnique({
            where: {
                contact_email: contact_email.trim()
            }
        });

        if (existingVendor) {
            return res.status(400).json({
                success: false,
                message: "Vendor email already exists"
            });
        }

        const vendor = await prisma.vendor.create({
            data: {
                company_name: company_name.trim(),
                contact_name: contact_name.trim(),
                contact_email: contact_email.trim(),
                contact_phone: contact_phone.trim(),
                support_portal: support_portal?.trim()
            }
        });

        return res.status(201).json({
            success: true,
            message: "Vendor created successfully",
            vendor
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }

};

export default createVendor;