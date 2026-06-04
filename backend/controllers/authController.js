import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../config/prisma.js";
export const register=async(req,res)=>{
    try{
        const {email,password,role}=req.body;
        const existingUser=await prisma.user.findUnique({where:{
            email,
        },});
        if(existingUser){
            return res.status(400).json({
                success:false,
                message:"User already exists",
            });
        }
        const hashedPassword=await bcrypt.hash(password,10);
        const user=await prisma.user.create({
            data:{
                email,
                password:hashedPassword,
                role,
            }
        });
        res.status(201).json({
            success:true,
            message:"User registered successfully",
            user,
        });
    }
    catch(error){
        console.error(error);
        res.status(500).json({
            success:false,
            message:"Internal Server Error",
        });
    }
};
export const login=async(req,res)=>{
    try{
        const {email,password}=req.body;
        const user=await prisma.user.findUnique({where:{
            email,
        },});
        if(!user){
            return res.status(400).json({
                success:false,
                message:"Invalid email or password",
            });
        }
        const isPasswordValid=await bcrypt.compare(password,user.password);
        if(!isPasswordValid){
            return res.status(400).json({
                success:false,
                message:"Invalid email or password",   
            });

        }
        const token=jwt.sign({userId:user.id,role:user.role},process.env.JWT_SECRET,{
            expiresIn:"7d",
        }
        );
        res.status(200).json({
            success:true,
            token,

        });

    }
    catch(error){
        console.log(error);
        res.status(500).json({
            success:false,
            message:"Internal Server Error",
        });
    }
};