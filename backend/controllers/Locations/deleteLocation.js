import prisma from "../../config/prisma.js";
const deleteLocation=async(req,res)=>{
    try{
        const {id} =req.params;
        const location=await prisma.location.findUnique({
            where:{
                location_id:id
            }
        });
        if(!location){
            return res.status(404).json({  
                success:false,
                message:"Location not found",
            });
        }
        await prisma.asset.updateMany({
            where:{
                location_id:id
            },
            data:{
                location_id:null
            }
        });
        await prisma.location.delete({
            where:{
                location_id:id
            }
        });
        return res.status(200).json({
            success:true,
            message:"Location deleted successfully",
        });
    }
    catch(error){
        console.error(error);
        return res.status(500).json({
            success:false,
            message:"Internal server error",
        });
    }
};
export default deleteLocation;