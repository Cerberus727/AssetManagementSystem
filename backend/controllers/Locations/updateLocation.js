import prisma from "../../config/prisma.js";
const updateLocation=async(req,res)=>{
    try{
        const {id}=req.params;
        const{
            building_name,
            floor,
            room_number,
            site_manager
        }=req.body;
        const existingLocation=await prisma.location.findUnique({
            where:{
                location_id:id
            }
        });
        if(!existingLocation){
            return res.status(404).json({
                success:false,
                message:"Location not found"
            })
        }
        if(building_name || floor || room_number){
            const duplicateLocation=await prisma.location.findFirst({
                where:{
                    building_name:building_name??existingLocation.building_name,
                    floor:floor??existingLocation.floor,
                    room_number:room_number??existingLocation.room_number,
                    NOT:{
                        location_id:id
                    }
                }
            });
            if(duplicateLocation){
                return res.status(400).json({
                    success:false,
                    message:"Location already used"
                })
            }
        }
        const updatedLocation=await prisma.location.update({
            where:{
                location_id:id
            },
            data:{
                building_name: building_name?.trim(),
                floor: floor?.trim(),
                room_number: room_number?.trim(),
                site_manager: site_manager?.trim()
            },
            include:{
                assets:true
            }
        });
        return res.status(200).json({
            success:true,
            message:"Location updated successfully",
            location:updatedLocation
        });
    }
    catch(error){
        console.error(error);
        return res.status(500).json({
            success:false,
            message:"Internal server error"
        });
    }
};
export default updateLocation;