import prisma from "../../config/prisma.js";
const getLocations=async(req,res)=>{
    try{
        const location=await prisma.location.findMany({
            include:{
                assets:true
            }
        });
        return res.status(200).json({
            success:true,
            message:"Locations retrieved successfully", 
            location
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
export default getLocations;