import prisma from "../../config/prisma.js";
const getVendorById=async(req,res)=>{
    try{
        const {id}=req.params;
        const vendor=await prisma.vendor.findUnique({
            where:{
                vendor_id:id
            }
            
        });
        if(!vendor){
            return res.status(404).json({
                success:false,
                message:"Vendor not found",
            });
        }
        return res.status(200).json({
            success:true,
            message:"Vendor retrieved successfully",
            vendor
        });
    }
    catch(error){
        console.error(error);
        return res.status(500).json({
            success:false,
            message:"Internal Server Error",
        });
    }
};
    export default getVendorById;