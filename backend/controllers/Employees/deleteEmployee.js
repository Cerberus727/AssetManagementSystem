import prisma from "../../config/prisma.js";
const deleteEmployee=async(req,res)=>{
    try{
        const {id} =req.params;
        const employee=await prisma.employee.findUnique({
            where:{
                employee_id:id
            }
        });
        if(!employee){
            return res.status(404).json({  
                success:false,
                message:"Employee not found",
            });
        }
        await prisma.asset.updateMany({
            where:{
                assigned_to:id
            },
            data:{
                assigned_to:null
            }
        });
        await prisma.employee.delete({
            where:{
                employee_id:id
            }
        });
        return res.status(200).json({
            success:true,
            message:"Employee deleted successfully",
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
export default deleteEmployee;   