import uploadToCloudinary from "../utilities/imageUpload.js";
  import Product from "../models/productModel.js";
 
 
  //Create a new product (Only admin can create a product)
 export const createProduct = async (req, res) => {
     try {
         const { name, price, description, category, stock } = req.body;
 
         //Ensure all required fields are provided
         if (!name || !description || !price || !category || !stock) {
             return res.status(400).json({ message: "All fields are required" });
         }
         // Check if image is provided
         if (!req.file) {
             return res.status(400).json({ message: "Product image is required" });
         }
      
         
         //image upload
         const cloudinaryRes = await uploadToCloudinary(req.file.path)
         console.log(cloudinaryRes,"image uploaded by cloudinary");
 
         // Create the new product
         const newProduct = new Product({
             
             name, price, description, category, stock, image: cloudinaryRes,seller: req.params.id
         })
         let savedProduct = await newProduct.save();
         if(savedProduct)
         {
             return res.status(200).json({ data: savedProduct, message: "Product created successfully" });
         }
         
     } catch (error) {
         console.log(error)
         res.status(error.status || 500).json({  error: error.message || "internal server error"});
     }
 };
  
 
//  Get All Products (Supports Category Filtering)
 export const getAllProducts = async (req, res, next) => {
     try {
         const { category,search } = req.query;
         let filter = {};
 
         if (category) {
             const validCategories = ["Men", "Women", "Kids"];
             const formattedCategory = category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();
             if (!validCategories.includes(formattedCategory)) {
                 return res.status(400).json({ message: "Invalid category. Allowed: Men, Women, Kids." });
             }
             filter.category = formattedCategory;
         }
 
             // Handle search filtering
    if (search) {
        filter.name = { $regex: search, $options: "i" }; // Case-insensitive regex search on product name
      }
         const productList = await Product.find(filter).select("-seller");
 
         if (productList.length === 0) {
             return res.status(404).json({ message: "No products found matching the criteria" });
         }
 
         res.json({ data: productList, message: "Products fetched successfully" });
     } catch (error) {
         res.status(error.statusCode || 500).json({
             message: "Error fetching products",
             error: error.message
         });
     }
 };
 
 
 
 
 
   //Get a product by ID
  export const getProductDetails = async (req, res, next) => {
      try {
 
 
          const product = await Product.findById(req.params.productId).populate("seller");
          if (!product) {
              return res.status(404).json({ message: "Product not found" });
          }
          res.json({ data: product, message: "User authorized" });
 
      } catch (error) {
          res.status(error.code || 500).json({ message: "Server error", error: error.message });
 
      }
  };
 
 
 
   //Update a product (Only admin can update a product)
 
  export const updateProduct = async (req, res) => {
      try {
          const { productId } = req.params;
          const updateData = req.body;
 
          const updatedProduct = await Product.findByIdAndUpdate(productId, updateData, { new: true });
 
          if (!updatedProduct) {
              return res.status(404).json({ message: "Product not found" });
          }
 
          res.json({ data: updatedProduct, message: "Product updated successfully" });
      } catch (error) {
          console.error("Error updating product:", error);
          res.status(500).json({ message: "Server error", error: error.message });
      }
  };
 
   //Delete a product (Only admin can delete a product)
  export const deleteProduct = async (req, res) => {
      try {
          const product = await Product.findByIdAndDelete(req.params.productId);
          if (!product) {
              return res.status(404).json({ message: "Product not found" });
          }
          res.status(200).json({ message: "Product deleted successfully" });
      } catch (error) {
          res.status(error.statusCode || 500).json({ message: "Error deleting products", error: error.message });
      }
  };
  //fetch products by seller
  export const getProductsBySeller = async (req, res) => {
      try {
          const { sellerId } = req.params;
          const products = await Product.find({ seller: sellerId, isActive: true })
          if (!products || products.length === 0) {
              return res.status(404).json({ message: "No products found for this seller" });
          }
          res.json({ data: products, message: "product fetched successfully" });
      } catch (error) {
          console.error("error fetching products by seller:", error);
          res.status(error.statusCode || 500).json({ message: "Server error", error: error.message });
      }
  }
  