// import Product from "../models/productModel.js";

// // Get all products
// export const getAllProducts = async (req, res) => {
//   try {
//     const products = await Product.find();
//     res.status(200).json(products);
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching products", error: error.message });
//   }
// };



// // Get a product by ID
// export const getProductById = async (req, res) => {
//   try {
//     const product = await Product.findById(req.params.id);
//     if (!product) {
//       return res.status(404).json({ message: "Product not found" });
//     }
//     res.status(200).json(product);
//   } catch (error) {
//     res.status(500).json({ message: "Error fetching product", error: error.message });
//   }
// };

// // Create a new product (Only admin can create a product)
// export const createProduct = async (req, res) => {
//   try {
//     const { name, price, description, category, image, stock } = req.body;

//     // Check if a product with the same name already exists
//     const existingProduct = await Product.findOne({ name });
//     if (existingProduct) {
//       return res.status(400).json({ message: "Product with this name already exists" });
//     }

//     // Create the new product
//     const newProduct = new Product({
//       name,
//       price,
//       description,
//       category,
//       image,
//       stock,
//     });

//     await newProduct.save();
//     res.status(201).json({ message: "Product created successfully", product: newProduct });
//   } catch (error) {
//     res.status(500).json({ message: "Error creating product", error: error.message });
//   }
// };

// // Update a product (Only admin can update a product)
// export const updateProduct = async (req, res) => {
//   try {
//     const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
//     if (!product) {
//       return res.status(404).json({ message: "Product not found" });
//     }
//     res.status(200).json({ message: "Product updated successfully", product });
//   } catch (error) {
//     res.status(500).json({ message: "Error updating product", error: error.message });
//   }
// };

// // Delete a product (Only admin can delete a product)
// export const deleteProduct = async (req, res) => {
//   try {
//     const product = await Product.findByIdAndDelete(req.params.id);
//     if (!product) {
//       return res.status(404).json({ message: "Product not found" });
//     }
//     res.status(200).json({ message: "Product deleted successfully" });
//   } catch (error) {
//     res.status(500).json({ message: "Error deleting product", error: error.message });
//   }
// };
