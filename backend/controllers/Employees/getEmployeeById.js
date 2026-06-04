import prisma from "../../config/prisma.js";
const getEmployeeById=async(req,res)=>{
    try{
        const {id}=req.params;
        const employee=await prisma.employee.findUnique({
            where:{
                employee_id:id,
            },
            include:{
                assets:true,
            }
        });
        if(!employee){
            return res.status(404).json({
                success:false,
                message:"Employee not found"
            });
        }
        return res.status(200).json({
            success:true,
            message:"Employee retrieved successfully",
            employee
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
export default getEmployeeById;