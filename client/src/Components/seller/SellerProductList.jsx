// // src/components/seller/SellerProductList.jsx
// import React, { useState, useEffect } from "react";
// import { axiosInstance } from "../../config/axiosInstance";
// import { toast } from "react-hot-toast";
// import {ProductCard} from "../user/Cards";

// const SellerProductList = () => {
//   const [products, setProducts] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const response = await axiosInstance.get("/seller/me");
//         setProducts(response.data.products);
//         setIsLoading(false);
//       } catch (error) {
//         console.error("Error fetching products:", error);
//         toast.error("Failed to load products");
//         setIsLoading(false);
//       }
//     };

//     fetchProducts();
//   }, []);

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <p className="text-xl text-gray-600 animate-pulse">Loading products...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-6xl mx-auto p-6">
//       <h1
//         className="text-3xl font-bold mb-6 text-gray-800"
//         style={{ fontFamily: "Playfair Display, serif" }}
//       >
//         Your Products
//       </h1>
//       {products.length === 0 ? (
//         <p className="text-gray-600">No products found. Add some products to get started!</p>
//       ) : (
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//           {products.map((product) => (
//             <ProductCard key={product._id} product={product} />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default SellerProductList;