// import Category from "../models/categoryModel.js";

// // Get all categories
// export const getAllCategories = async (req, res) => {
//   try {
//     const categories = await Category.find();
//     res.status(200).json(categories);
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching categories", error });
//   }
// };

// // Create a new category (Admin only)
// export const createCategory = async (req, res) => {
//   try {
//     const { name } = req.body;

//     // Check if category already exists
//     const existingCategory = await Category.findOne({ name });
//     if (existingCategory) {
//       return res.status(400).json({ message: "Category already exists" });
//     }

//     const category = new Category({ name });
//     await category.save();

//     res.status(201).json({ message: "Category created successfully", category });
//   } catch (error) {
//     res.status(500).json({ message: "Error creating category", error });
//   }
// };

// // Update a category (Admin only)
// export const updateCategory = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { name } = req.body;

//     const category = await Category.findByIdAndUpdate(id, { name }, { new: true });

//     if (!category) {
//       return res.status(404).json({ message: "Category not found" });
//     }

//     res.status(200).json({ message: "Category updated successfully", category });
//   } catch (error) {
//     res.status(500).json({ message: "Error updating category", error });
//   }
// };

// // Delete a category (Admin only)
// export const deleteCategory = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const category = await Category.findByIdAndDelete(id);

//     if (!category) {
//       return res.status(404).json({ message: "Category not found" });
//     }

//     res.status(200).json({ message: "Category deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ message: "Error deleting category", error });
//   }
// };
