import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { axiosInstance } from "../../config/axiosInstance";
import ProductCard from "../../Components/user/Cards";
import { ProductCardSkeltons } from "../../Components/user/Skeltons";

export const Home = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // For new arrivals (2 rows of 5)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const response = await axiosInstance.get("/product/productList");
        setProducts(response.data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const totalPages = Math.ceil(products.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedProducts = products.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="w-screen">
      {/*  Full-Width Banner Carousel */}
      <div className="w-screen h-[500px] overflow-hidden">
        <div className="carousel w-full h-full">
          {["B2", "B1", "B3", "B4"].map((img, index) => (
            <div key={index} id={`slide${index + 1}`} className="carousel-item relative w-full h-full">
              <img
                src={`/image/${img}.jpg`}
                className="absolute inset-0 w-full h-full object-cover"
                alt={`Slide ${index + 1}`}
              />
              <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 justify-between">
                <a href={`#slide${index === 0 ? 4 : index}`} className="btn btn-circle bg-white text-black">❮</a>
                <a href={`#slide${index === 3 ? 1 : index + 2}`} className="btn btn-circle bg-white text-black">❯</a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/*  View All Products */}
      <div className="w-full px-4 py-8">
  <h2 className="text-2xl font-bold text-center mb-6">
    <Link to="/product" className="text-black hover:underline">
      View All Products
    </Link>
  </h2>
</div>

      {/*  First Section of Product Cards */}
      {error && <p className="text-red-500 text-center">Error loading products: {error}</p>}
      <div className="w-full px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {isLoading
          ? [...Array(5)].map((_, index) => <ProductCardSkeltons key={index} />)
          : products.slice(0, 5).map((product) => (
              <ProductCard products={product} key={product?._id} showDescription={false} />
            ))}
      </div>

      {/* 🏷 Super Saver Offers */}
      <div className="w-full px-4 py-8">
        <h2 className="text-2xl font-bold text-center mb-6">Super Saver Offers</h2>
        <img
          src="/image/bannerfull.gif"
          alt="Super Saver Offers"
          className="w-full h-[220px] md:h-[280px] rounded-lg object-cover shadow-md"
        />
      </div>

      {/*  Browse by Category */}
      <div className="w-full px-4 py-8">
        <h2 className="text-2xl font-bold text-center mb-6">Browse by Category</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-6xl mx-auto text-center">
          {[
            { name: "Men", img: "/image/m1.jpg", path: "/product?category=Men" },
            { name: "Kids", img: "/image/k1.jpg", path: "/product?category=Kids" },
            { name: "Women", img: "/image/jas.png", path: "/product?category=Women" },
          ].map((cat, idx) => (
            <Link key={idx} to={cat.path}>
              <div className="group transition-transform duration-300 transform hover:scale-105 hover:shadow-lg rounded-lg overflow-hidden">
                <img
                  src={cat.img}
                  alt={cat.name}
                  className="w-full h-[250px] object-cover transition-transform duration-300"
                />
                <p className="mt-2 text-lg font-semibold group-hover:underline">{cat.name}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* 🆕 New Arrivals Section */}
      <div className="w-full px-4 py-8">
        <h2 className="text-2xl font-bold text-center mb-6">New Arrivals</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {isLoading
            ? [...Array(itemsPerPage)].map((_, index) => <ProductCardSkeltons key={index} />)
            : displayedProducts.map((product) => (
                <ProductCard products={product} key={product?._id} showDescription={false} />
              ))}
        </div>

        {/* Pagination for New Arrivals */}
        {totalPages > 1 && (
          <div className="w-full flex justify-end mt-4 pr-4">
            <button
              className={`px-2 py-1 text-sm border rounded ${
                currentPage === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-300"
              }`}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              ❮ Prev
            </button>
            <span className="px-3 text-sm">{currentPage} / {totalPages}</span>
            <button
              className={`px-2 py-1 text-sm border rounded ${
                currentPage === totalPages ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-300"
              }`}
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              Next ❯
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
