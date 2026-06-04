import prisma from "../../config/prisma.js";
const getAssetById=async (req,res)=>{
    try{
        const {id}=req.params;
        const asset=await prisma.asset.findUnique({
            where:{
                asset_id:id,
            },
            include:{
                employee:true,
                location:true,
                tickets:true
            }
        });
        return res.status(200).json({
            success:true,
            message:"Asset retrieved successfully",
            asset
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
export default getAssetById;