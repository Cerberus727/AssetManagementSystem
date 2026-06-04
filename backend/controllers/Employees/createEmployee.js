import prisma from "../../config/prisma.js";
const createEmployee=async(req,res)=>{
    try{
        const{
            first_name,
            last_name,
            email,
            department,
            role
        }=req.body;
        if(!first_name || !last_name || !email || !department || !role){
            return res.status(400).json({
                success:false,
                message:"All fields are required",
            });
        }
        if(first_name.trim()==="" || last_name.trim()==="" || email.trim()==="" || department.trim()==="" || role.trim()===""){
            return res.status(400).json({
                success:false,
                message:"Fields cannot be empty",
            });
        }
        const emailRegex=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(email)){
            return res.status(400).json({
                success:false,
                message:"Invalid email format",
            });
        }
        const existingEmployee=await prisma.employee.findUnique({
            where:{
                email,
            }
        });
        if(existingEmployee){
            return res.status(400).json({
                success:false,
                message:"Email already exists",
            });
        }
        const employee=await prisma.employee.create({
            data:{
                first_name: first_name.trim(),
                last_name: last_name.trim(),
                email: email.trim(),
                department: department.trim(),
                role: role.trim()
            },
            include:{
                assets:true
            }
        });
        return res.status(201).json({
            success:true,
            message:"Employee created successfully",
            employee,
        });
    }
    catch(error){
        console.error(error);
        return res.status(500).json({
            success:false,
            message:"Internal Server Error",
        });
    }
}
export default createEmployee;