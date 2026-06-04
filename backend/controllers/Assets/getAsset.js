import prisma from "../../config/prisma.js";
const getAssets=async(req,res)=>{
    try{
        const assets=await prisma.asset.findMany({
            include:{
                employee:true,
                location:true,
                tickets:true
            }
        });
        return res.status(200).json({
            success:true,
            message:"Assets retrieved successfully",    
            assets
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
export default getAssets;