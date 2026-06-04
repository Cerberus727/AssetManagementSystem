import prisma from "../../config/prisma.js";
const updateAsset=async(req,res)=>{
    try{
        const {id}=req.params;
         const {
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
            purchase_cost
        } = req.body;
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
        if(asset_tag){
            const assetTagExists=await prisma.asset.findUnique({
                where:{
                    asset_tag,
                    NOT:{
                        asset_id:id,
                    }
                }
            });
            if(assetTagExists){
                return res.status(400).json({
                    success:false,
                    message:"Asset tag already exists",
                });
            }
        }
        if(serial_number){
            const serialNumberExists=await prisma.asset.findFirst({
                where:{
                    serial_number, 
                    NOT:{
                        asset_id:id,
                    }
                }
            });
            if(serialNumberExists){
                return res.status(400).json({
                    success:false,
                    message:"Serial number already exists",
                });
            }
        }
        if(purchase_cost!==undefined && purchase_cost<0){
            return res.status(400).json({
                success:false,
                message:"Purchase cost cannot be negative",
            });
        }
        const finalPurchaseDate=purchase_date?new Date(purchase_date):existingAsset.purchase_date;
        const finalWarrantyExpiry=warranty_expiry?new Date(warranty_expiry):existingAsset.warranty_expiry;
        if(finalWarrantyExpiry<=finalPurchaseDate){
            return res.status(400).json({
                success:false,
                message:"Warranty expiry date must be after purchase date",
            });
        }
        if(assigned_to){
            const employeeExists=await prisma.employee.findUnique({
                where:{
                    employee_id:assigned_to,
                }
            });
            if(!employeeExists){
                return res.status(404).json({
                    success:false,
                    message:"Employee not found",
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
                return res.status(404).json({
                    success:false,
                    message:"Location not found",
                });
            }
        }
        const updatedAsset=await prisma.asset.update({
            where:{
                asset_id:id,
            },
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
                purchase_date:purchase_date?new Date(purchase_date):undefined,
                warranty_expiry:warranty_expiry?new Date(warranty_expiry):undefined,
                purchase_cost
            },
            include:{
                employee:true,
                location:true,
            }
        });
        return res.status(200).json({
            success:true,
            message:"Asset updated successfully",
            asset:updatedAsset,
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
export default updateAsset;