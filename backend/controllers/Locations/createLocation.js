import prisma from "../../config/prisma.js";
const createLocation=async(req,res)=>{
    try{
        const{
            building_name,
            floor,
            room_number,
            site_manager,
        }=req.body;
        if(!building_name || !floor || !room_number || !site_manager){
            return res.status(400).json({
                success:false,
                message:"All fields are required",
            });
        }
        if(building_name.trim()==="" || floor.trim()==="" || room_number.trim()==="" || site_manager.trim()===""){
            return res.status(400).json({
                success:false,
                message:"Fields cannot be empty",
            });
        }
        const existingLocation=await prisma.location.findFirst({
            where:{
                building_name:building_name.trim(),

                floor:floor.trim(),
                room_number: room_number.trim()
            }
        });
        if(existingLocation){
            return res.status(400).json({
                success:false,
                message: "Location already used"
            })
        }
        const location=await prisma.location.create({
            data:{
                building_name: building_name.trim(),
                floor: floor.trim(),
                room_number: room_number.trim(),
                site_manager: site_manager?.trim()
            },
            include: {
                assets:true
            }
        });
        return res.status(201).json({
            success:true,
            message: "Location created successfully",
            location
        });
    }
    catch(error){
        console.error(error);
        return res.status(500).json({
            success:false,
            message: "Internal server error"
        });
    
    }
};
export default createLocation;