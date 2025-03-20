import express from "express";
import { getAllCategories, createCategory, updateCategory, deleteCategory } from "../controllers/categoryController.js";


import { authAdmin } from "../middleware/authAdmin.js";

const router = express.Router();

router.get("/", getAllCategories);
router.post("/",authAdmin, createCategory);
router.put("/:id", authAdmin, updateCategory);
router.delete("/:id",authAdmin, deleteCategory);

export default router;
