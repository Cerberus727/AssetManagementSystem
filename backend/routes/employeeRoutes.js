import express from "express";
import createEmployee from "../controllers/Employees/createEmployee.js";
import updateEmployee from "../controllers/Employees/updateEmployee.js";
import deleteEmployee from "../controllers/Employees/deleteEmployee.js";
import getEmployees from "../controllers/Employees/getEmployees.js";
import getEmployeeById from "../controllers/Employees/getEmployeeById.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router=express.Router();
router.post("/",authMiddleware,createEmployee);
router.put("/:id",authMiddleware,updateEmployee);
router.delete("/:id",authMiddleware,deleteEmployee);
router.get("/",authMiddleware,getEmployees);
router.get("/:id",authMiddleware,getEmployeeById);
export default router;