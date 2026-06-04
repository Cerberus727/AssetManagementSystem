import prisma from "../../config/prisma.js";
const deleteAsset=async(req,res)=>{
    try{
        const {id}=req.params;
        const existingAsset=await prisma.asset.findUnique({
            where:{
                asset_id:id,
            }
        });
        if(!existingAsset){
            return res.status(404).json({
                success:false,
                message:"Asset not found",
            });
        }
        await prisma.asset.delete({
            where:{
                asset_id:id,
            }
        });
        return res.status(200).json({
            success:true,
            message:"Asset deleted successfully",
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
export default deleteAsset;
