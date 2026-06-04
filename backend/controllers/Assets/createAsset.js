import prisma from "../../config/prisma.js";
const createAsset=async(req,res)=>{
    try{
        const{
            asset_tag,
            category,
            sub_category,
            manufacturer,
            model_number,
            serial_number,
            status,
            po_no,
            assigned_to,
            location_id,
            purchase_date,
            warranty_expiry,
            purchase_cost,
        }=req.body;
        if(!asset_tag || !category || !manufacturer || !model_number || !serial_number || !status || !po_no || !purchase_date || !warranty_expiry || !purchase_cost){
            return res.status(400).json({
                success:false,
                message:"All fields are required",
            });
        }
        const purchaseDateObj=new Date(purchase_date);
        const warrantyDateObj=new Date(warranty_expiry);
        if(warrantyDateObj<=purchaseDateObj){
            return res.status(400).json({
                success:false,
                message:"Warranty expiry date must be after purchase date",
            });
        }
        const existingAssetTag=await prisma.asset.findUnique({
            where:{
                asset_tag,
            }
        });
        if(existingAssetTag){
            return res.status(400).json({
                success:false,
                message:"Asset tag already exists",
            });
        }
        const existingSerialNumber=await prisma.asset.findFirst({
            where:{
                serial_number,
            }
        });
        if(existingSerialNumber){
            return res.status(400).json({
                success:false,
                message:"Serial number already exists",
            });
        }
        if(assigned_to){
            const employeeExists=await prisma.employee.findUnique({
                where:{
                    employee_id:assigned_to,    
                }
            });
            if(!employeeExists){
                return res.status(400).json({
                    success:false,
                    message:"Assigned employee does not exist",
                });
            }
        }
        if(location_id){
            const locationExists=await prisma.location.findUnique({
                where:{
                    location_id,
                }
            });
            if(!locationExists){
                return res.status(400).json({
                    success:false,
                    message:"Location does not exist",
                });
            }
        }
        const asset=await prisma.asset.create({
            data:{
                asset_tag,
                category,
                sub_category,
                manufacturer,
                model_number,
                serial_number,
                status,
                po_no,
                assigned_to,
                location_id,
                purchase_date:purchaseDateObj,
                warranty_expiry:warrantyDateObj,
                purchase_cost,
            },
            include:{
                employee:true,
                location:true,
            }
        });
        return res.status(201).json({
            success:true,
            message:"Asset created successfully",
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
export default createAsset;