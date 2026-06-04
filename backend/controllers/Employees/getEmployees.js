import prisma from "../../config/prisma.js";
const getEmployees=async(req,res)=>{
    try{
        const employees=await prisma.employee.findMany({
            include:{
                assets:true
            }
        });
        return res.status(200).json({
            success:true,
            message:"Employees retrieved successfully",
            employees
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
export default getEmployees;