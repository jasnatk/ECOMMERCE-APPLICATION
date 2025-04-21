import uploadToCloudinary, { destroyImageFromCloudinary } from "../utilities/imageUpload.js";
import Product from "../models/productModel.js";

// Create a single product
export const createProduct = async (req, res) => {
  try {
    console.log("Received body:", req.body);
    console.log("Received files:", req.files);

    const { name, price, description, category, stock } = req.body;

    if (!name || !price || !description || !category) {
      return res.status(400).json({ message: "Name, price, description, and category are required" });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "At least one product image is required" });
    }

    const uploadedImages = [];
    for (const file of req.files) {
      console.log("Uploading file:", file.path);
      const result = await uploadToCloudinary(file.path);
      uploadedImages.push(result);
    }

    const newProduct = new Product({
      name,
      price,
      description,
      category,
      stock: stock || 0,
      images: uploadedImages,
      seller: req.seller.id,
    });

    const savedProduct = await newProduct.save();

    return res.status(201).json({
      data: savedProduct,
      message: "Product created successfully",
    });
  } catch (error) {
    console.error("Error creating product:", error.message);
    res.status(500).json({
      message: `Failed to create product: ${error.message}`,
      error: error.message,
    });
  }
};

// Create multiple products
export const createMultipleProducts = async (req, res) => {
  try {
    console.log("Received body:", req.body);
    console.log("Received files:", req.files);

    const productsData = req.body.products ? JSON.parse(req.body.products) : [];
    if (!Array.isArray(productsData) || productsData.length === 0) {
      return res.status(400).json({ message: "Products array is required" });
    }

    const createdProducts = [];
    for (let i = 0; i < productsData.length; i++) {
      const productData = productsData[i];
      const { name, price, description, category, stock } = productData;

      if (!name || !price || !description || !category) {
        return res.status(400).json({ message: `Missing required fields for product ${i + 1}` });
      }

      const productImages = req.files.filter((file) => file.fieldname === `images[${i}]`);
      if (!productImages || productImages.length === 0) {
        return res.status(400).json({ message: `No images provided for product ${i + 1}` });
      }

      const uploadedImages = [];
      for (const file of productImages) {
        console.log("Uploading file for product", i, ":", file.path);
        const result = await uploadToCloudinary(file.path);
        uploadedImages.push(result);
      }

      const newProduct = new Product({
        name,
        price,
        description,
        category,
        stock: stock || 0,
        images: uploadedImages,
        seller: req.seller.id,
      });

      const savedProduct = await newProduct.save();
      createdProducts.push(savedProduct);
    }

    return res.status(201).json({
      data: createdProducts,
      message: "Products created successfully",
    });
  } catch (error) {
    console.error("Error creating multiple products:", error.message);
    res.status(500).json({
      message: `Failed to create products: ${error.message}`,
      error: error.message,
    });
  }
};

function getPublicIdFromUrl(url) {
  const parts = url.split("/");
  const publicIdWithExtension = parts[parts.length - 1];
  return publicIdWithExtension.split(".")[0];
}

// Update product with image replacement logic
export const updateProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const { name, price, description, category, stock, existingImages } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    let updatedImages = [];

    if (existingImages) {
      let parsedImages;
      try {
        parsedImages = typeof existingImages === "string" ? JSON.parse(existingImages) : existingImages;
      } catch (error) {
        return res.status(400).json({ message: "Invalid existing images format" });
      }

      updatedImages = parsedImages.map((img) => ({
        url: typeof img === "string" ? img : img.url,
        public_id: typeof img === "string" ? getPublicIdFromUrl(img) : img.public_id,
      }));
    } else {
      updatedImages = product.images;
    }

    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const uploadedImage = await uploadToCloudinary(file.path);
        updatedImages.push(uploadedImage);
      }
    }

    // Detect and remove deleted images
    const oldImages = product.images || [];
    const updatedImagePublicIds = updatedImages.map(img => img.public_id);
    const imagesToDelete = oldImages.filter(
      (img) => !updatedImagePublicIds.includes(img.public_id)
    );

    for (const img of imagesToDelete) {
      await destroyImageFromCloudinary(img.public_id);
    }

    product.name = name || product.name;
    product.price = price || product.price;
    product.description = description || product.description;
    product.category = category || product.category;
    product.stock = stock || product.stock;
    product.images = updatedImages;

    const updatedProduct = await product.save();

    res.status(200).json({ data: updatedProduct, message: "Product updated successfully" });
  } catch (error) {
    console.error("Error updating product:", error.message);
    res.status(500).json({ message: "Error updating product", error: error.message });
  }
};

// Get all products
export const getAllProducts = async (req, res) => {
  try {
    const { category, search, minPrice, maxPrice, minRating, stock, sortByPrice, sortByRating } = req.query;
    let filter = {};

    if (category) {
      const validCategories = ["Men", "Women", "Kids"];
      const formattedCategory = category.charAt(0).toUpperCase() + category.slice(1).toLowerCase();
      if (!validCategories.includes(formattedCategory)) {
        return res.status(400).json({ message: "Invalid category. Allowed: Men, Women, Kids." });
      }
      filter.category = formattedCategory;
    }

    if (search) {
      filter.name = { $regex: search, $options: "i" };
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = minPrice;
      if (maxPrice) filter.price.$lte = maxPrice;
    }

    if (minRating) {
      filter.rating = { $gte: minRating };
    }

    if (stock) {
      filter.stock = { $gte: stock };
    }

    let query = Product.find(filter).select("-seller");

    if (sortByPrice) {
      const sortOrder = sortByPrice === "asc" ? 1 : -1;
      query = query.sort({ price: sortOrder });
    }

    if (sortByRating) {
      const sortOrder = sortByRating === "asc" ? 1 : -1;
      query = query.sort({ rating: sortOrder });
    }

    const products = await query;
    if (products.length === 0) return res.status(404).json({ message: "No products found" });

    res.json({ data: products, message: "Products fetched successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error fetching products", error: error.message });
  }
};

// Get single product
export const getProductDetails = async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId).populate("seller");
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json({ data: product, message: "Product fetched successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete product
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    for (const img of product.images) {
      await destroyImageFromCloudinary(img.public_id);
    }

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting product", error: error.message });
  }
};


export const updateProductStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { stock } = req.body;

    const product = await Product.findById(id);

    if (!product) return res.status(404).json({ message: "Product not found" });

    product.stock = stock;
    await product.save();

    res.status(200).json({ message: "Stock updated successfully", product });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
