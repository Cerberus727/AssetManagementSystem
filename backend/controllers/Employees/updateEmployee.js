import prisma from "../../config/prisma.js";
const updateEmployee=async(req,res)=>{
    try{
        const {id}=req.params;
        const{
            first_name,
            last_name,
            email, 
            department,
            role

        }=req.body;
        const existingEmployee=await prisma.employee.findUnique({
            where:{
                employee_id:id
            }
        });
        if(!existingEmployee){
            return res.status(404).json({
                success:false,
                message:"Employee not found",
            });
        }
        if(email){
            const emailRegex=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if(!emailRegex.test(email)){
                return res.status(400).json({
                    success:false,
                    message:"Invalid email format",
                });
            }
            const emailExists=await prisma.employee.findUnique({
                where:{
                    email,
                    NOT:{
                        employee_id:id
                    }
                }
            });
            if(emailExists){
                return res.status(400).json({
                    success:false,
                    message:"Email already exists",
                });
            }
        }
        const updatedEmployee=await prisma.employee.update({
            where:{
                employee_id:id
            },
            data:{
                first_name:first_name?.trim(),
                last_name: last_name?.trim(),
                email: email?.trim(),
                department: department?.trim(),
                role: role?.trim()
            }
            ,
            include:{
                assets:true
            }
        });
        return res.status(200).json({
            success:true,
            message:"Employee updated successfully",
            data:updatedEmployee
        });
    }catch(error){
        console.error("Error updating employee:", error);
        return res.status(500).json({
            success:false,
            message:"Internal server error"
        });
    }

};
export default updateEmployee;