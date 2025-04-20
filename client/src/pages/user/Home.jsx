import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { axiosInstance } from "../../config/axiosInstance";  
import { ProductCardSkeltons } from "../../Components/user/Skeltons"; 
import { ProductCard } from "../../Components/user/Cards";


export const Home = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPageTop, setCurrentPageTop] = useState(1); // Pagination for the top products section
  const [currentPageNewArrivals, setCurrentPageNewArrivals] = useState(1); // Pagination for new arrivals section
  const [currentSlide, setCurrentSlide] = useState(0); // State to track current carousel slide
  const itemsPerPage = 5; // Limit the products per page to 5

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

    // Automatic carousel movement every 3 seconds
    const intervalId = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % 4); // Assuming 4 slides in total
    }, 3000); // Change slide every 3 seconds

    // Cleanup the interval on component unmount
    return () => clearInterval(intervalId);

  }, []);

  // First 5 products for top product section
  const topFiveProducts = products.slice(2, 7);

  // New Arrivals starting from the latest 11 products
  const newArrivalsAll = products.slice(-11);
  const totalPagesTop = Math.ceil(topFiveProducts.length / itemsPerPage);
  const totalPagesNewArrivals = Math.ceil(newArrivalsAll.length / itemsPerPage);

  // Paginated top product section
  const startIndexTop = (currentPageTop - 1) * itemsPerPage;
  const paginatedTopProducts = topFiveProducts.slice(startIndexTop, startIndexTop + itemsPerPage);

  // Paginated New Arrivals section
  const startIndexNewArrivals = (currentPageNewArrivals - 1) * itemsPerPage;
  const paginatedNewArrivals = newArrivalsAll.slice(startIndexNewArrivals, startIndexNewArrivals + itemsPerPage);

  // Handlers for the left and right buttons
  const handlePrevSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide === 0 ? 3 : prevSlide - 1)); // Loop to the last slide when on the first one
  };

  const handleNextSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % 4); // Loop to the first slide when on the last one
  };

  return (
    <div className="w-screen ">
      {/*  Banner Carousel */}
      <div className="w-screen h-[500px] overflow-hidden shadow-md shadow-black/20 border rounded">
        <div className="carousel w-full h-full">
          {["B2", "B1", "B3", "B4"].map((img, index) => (
            <div key={index} id={`slide${index + 1}`} className={`carousel-item relative w-full h-full ${currentSlide === index ? 'block' : 'hidden'}`}>
              <img
                src={`/image/${img}.jpg`}
                className="absolute inset-0 w-full h-full object-cover"
                alt={`Slide ${index + 1}`}
              />
              <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 justify-between">
                <button onClick={handlePrevSlide} className="btn btn-circle bg-white text-black">❮</button>
                <button onClick={handleNextSlide} className="btn btn-circle bg-white text-black">❯</button>
              </div>
            </div>
          ))}
        </div>
      </div>
      

      {/* View All Products */}
      <div className="w-full pt-5">
        <h2 className="text-3xl font-bold text-center mb-6 hover:underline">
          <Link to="/product">
            Featured Products
          </Link>
        </h2>

      </div>

      {/* First Section of Product Cards */}
      {error && <p className="text-red-500 text-center">Error loading products: {error}</p>}
      <div className="w-full px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {isLoading
          ? [...Array(itemsPerPage)].map((_, index) => <ProductCardSkeltons key={index} />)
          : paginatedTopProducts.map((product) => (
              <ProductCard products={product} key={product?._id} showDescription={false} />
            ))}
      </div>

      {/* Pagination for Top Product Section */}
      {totalPagesTop > 1 && (
        <div className="w-full flex justify-end mt-4 pr-4 items-center gap-4">
          <button
            className={`px-3 py-1 text-sm border rounded ${currentPageTop === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-300"}`}
            onClick={() => setCurrentPageTop((prev) => Math.max(prev - 1, 1))}
            disabled={currentPageTop === 1}
          >
            ❮ Prev
          </button>
          <span className="text-sm">{currentPageTop} / {totalPagesTop}</span>
          <button
            className={`px-3 py-1 text-sm border rounded ${currentPageTop === totalPagesTop ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-300"}`}
            onClick={() => setCurrentPageTop((prev) => Math.min(prev + 1, totalPagesTop))}
            disabled={currentPageTop === totalPagesTop}
          >
            Next ❯
          </button>
        </div>
      )}

      {/* 🏷 Super Saver Offers */}
      <div className="w-full px-4 py-8">
        <h2 className="text-2xl font-bold text-center mb-6">Super Saver Offers</h2>
        <img
          src="/image/bannerfull.gif"
          alt="Super Saver Offers"
          className="w-full h-[220px] md:h-[280px] rounded-lg object-cover shadow-md"
        />
      </div>

      {/* Browse by Category */}
      <div className="w-full px-4 py-2">
        <h2 className="text-2xl font-bold text-center mb-6">Browse by Category</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-6xl mx-auto text-center">
          {[{ name: "Men", img: "/image/m1.jpg", path: "/product?category=Men" },
            { name: "Kids", img: "/image/k1.jpg", path: "/product?category=Kids" },
            { name: "Women", img: "/image/jas.png", path: "/product?category=Women" }].map((cat, idx) => (
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

      {/* New Arrivals Section */}
      <div className="w-full px-4 py-2">
        <h2 className="text-2xl font-bold text-center mb-6">New Arrivals</h2>
        <div className="w-full px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {isLoading
            ? [...Array(itemsPerPage)].map((_, index) => <ProductCardSkeltons key={index} />)
            : paginatedNewArrivals.map((product) => (
                <ProductCard products={product} key={product?._id} showDescription={false} />
              ))}
        </div>

        {/* Pagination for New Arrivals */}
        
        {/* Pagination for New Arrivals */}
{totalPagesNewArrivals > 1 && (
  <div className="w-full flex justify-end mt-6 pr-4">
    <nav aria-label="Pagination" className="flex items-center gap-2">
      {/* Previous Button */}
      <button
        className={`px-4 py-2 text-sm font-medium rounded-full border border-gray-300 transition-all duration-200 ${
          currentPageNewArrivals === 1
            ? "opacity-50 cursor-not-allowed bg-gray-100"
            : "hover:bg-gray-100 hover:border-gray-400 active:bg-gray-200"
        }`}
        onClick={() => setCurrentPageNewArrivals((prev) => Math.max(prev - 1, 1))}
        disabled={currentPageNewArrivals === 1}
        aria-label="Previous page"
      >
        ❮
      </button>

      {/* Page Numbers */}
      {(() => {
        const pages = [];
        const maxPagesToShow = 5; // Adjust this to control how many page numbers to display
        const halfRange = Math.floor(maxPagesToShow / 2);
        let startPage = Math.max(1, currentPageNewArrivals - halfRange);
        let endPage = Math.min(totalPagesNewArrivals, startPage + maxPagesToShow - 1);

        // Adjust startPage if endPage is at the maximum
        if (endPage - startPage + 1 < maxPagesToShow) {
          startPage = Math.max(1, endPage - maxPagesToShow + 1);
        }

        // Add first page and ellipsis if needed
        if (startPage > 1) {
          pages.push(
            <button
              key={1}
              className={`px-4 py-2 text-sm font-medium rounded-full border border-gray-300 transition-all duration-200 ${
                currentPageNewArrivals === 1
                  ? "bg-gray-800 text-white border-gray-800"
                  : "hover:bg-gray-100 hover:border-gray-400 active:bg-gray-200"
              }`}
              onClick={() => setCurrentPageNewArrivals(1)}
              aria-label={`Page 1${currentPageNewArrivals === 1 ? ", current" : ""}`}
            >
              1
            </button>
          );
          if (startPage > 2) {
            pages.push(
              <span key="start-ellipsis" className="px-2 text-sm text-gray-500">
                ...
              </span>
            );
          }
        }

        // Add page numbers
        for (let i = startPage; i <= endPage; i++) {
          pages.push(
            <button
              key={i}
              className={`px-4 py-2 text-sm font-medium rounded-full border border-gray-300 transition-all duration-200 ${
                currentPageNewArrivals === i
                  ? "bg-gray-800 text-white border-gray-800"
                  : "hover:bg-gray-100 hover:border-gray-400 active:bg-gray-200"
              }`}
              onClick={() => setCurrentPageNewArrivals(i)}
              aria-label={`Page ${i}${currentPageNewArrivals === i ? ", current" : ""}`}
            >
              {i}
            </button>
          );
        }

        // Add last page and ellipsis if needed
        if (endPage < totalPagesNewArrivals) {
          if (endPage < totalPagesNewArrivals - 1) {
            pages.push(
              <span key="end-ellipsis" className="px-2 text-sm text-gray-500">
                ...
              </span>
            );
          }
          pages.push(
            <button
              key={totalPagesNewArrivals}
              className={`px-4 py-2 text-sm font-medium rounded-full border border-gray-300 transition-all duration-200 ${
                currentPageNewArrivals === totalPagesNewArrivals
                  ? "bg-gray-800 text-white border-gray-800"
                  : "hover:bg-gray-100 hover:border-gray-400 active:bg-gray-200"
              }`}
              onClick={() => setCurrentPageNewArrivals(totalPagesNewArrivals)}
              aria-label={`Page ${totalPagesNewArrivals}${
                currentPageNewArrivals === totalPagesNewArrivals ? ", current" : ""
              }`}
            >
              {totalPagesNewArrivals}
            </button>
          );
        }

        return pages;
      })()}

      {/* Next Button */}
      <button
        className={`px-4 py-2 text-sm font-medium rounded-full border border-gray-300 transition-all duration-200 ${
          currentPageNewArrivals === totalPagesNewArrivals
            ? "opacity-50 cursor-not-allowed bg-gray-100"
            : "hover:bg-gray-100 hover:border-gray-400 active:bg-gray-200"
        }`}
        onClick={() => setCurrentPageNewArrivals((prev) => Math.min(prev + 1, totalPagesNewArrivals))}
        disabled={currentPageNewArrivals === totalPagesNewArrivals}
        aria-label="Next page"
      >
        ❯
      </button>
    </nav>
  </div>
)}
      </div>
    </div>
  );
};
