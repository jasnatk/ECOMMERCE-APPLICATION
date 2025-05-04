import React, { useEffect, useState, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import { axiosInstance } from "../../config/axiosInstance";
import { ProductCardSkeltons } from "../../Components/user/Skeltons";
import { ProductCard } from "../../Components/user/Cards";

// LoadingSpinner Component (unchanged)
const LoadingSpinner = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-gray-100 bg-opacity-75 z-50">
    <div className="w-16 h-16 border-4 border-t-blue-500 border-gray-200 rounded-full animate-spin"></div>
  </div>
);

// BannerSkeleton Component (simplified animation)
const BannerSkeleton = () => (
  <div className="w-full h-[300px] sm:h-[400px] lg:h-[500px] bg-gray-200 rounded animate-pulse">
    <div className="w-full h-full relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-[shimmer_2s_infinite_linear]"></div>
    </div>
  </div>
);

// Custom LazyLoad component using IntersectionObserver (no dependencies)
const LazyLoad = ({ children, height = 200, offset = 100 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: `${offset}px` }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [offset]);

  return (
    <div ref={ref} style={{ minHeight: height }}>
      {isVisible ? children : null}
    </div>
  );
};

export const Home = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPageTop, setCurrentPageTop] = useState(1);
  const [currentPageNewArrivals, setCurrentPageNewArrivals] = useState(1);
  const [currentSlide, setCurrentSlide] = useState(0);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        // Check local storage for cached products
        const cachedProducts = localStorage.getItem('products');
        if (cachedProducts) {
          setProducts(JSON.parse(cachedProducts));
          setIsLoading(false);
        }
        // Fetch only 15 products with specific fields
        const response = await axiosInstance.get("/product/productList", {
          params: { page: 1, limit: 15, fields: 'id,name,price,image' },
        });
        setProducts(response.data.data);
        localStorage.setItem('products', JSON.stringify(response.data.data));
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Separate effect for carousel to isolate re-renders
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % 4);
    }, 4000); // Increased to 4s to reduce re-renders

    return () => clearInterval(intervalId);
  }, []);

  const topFiveProducts = products.slice(2, 7);
  const newArrivalsAll = products.slice(-10);
  const totalPagesTop = Math.ceil(topFiveProducts.length / itemsPerPage);
  const totalPagesNewArrivals = Math.ceil(newArrivalsAll.length / itemsPerPage);

  const startIndexTop = (currentPageTop - 1) * itemsPerPage;
  const paginatedTopProducts = topFiveProducts.slice(startIndexTop, startIndexTop + itemsPerPage);

  const startIndexNewArrivals = (currentPageNewArrivals - 1) * itemsPerPage;
  const paginatedNewArrivals = newArrivalsAll.slice(startIndexNewArrivals, startIndexNewArrivals + itemsPerPage);

  // Memoize handlers to prevent re-renders
  const handlePrevSlide = useCallback(() => {
    setCurrentSlide((prevSlide) => (prevSlide === 0 ? 3 : prevSlide - 1));
  }, []);

  const handleNextSlide = useCallback(() => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % 4);
  }, []);

  return (
    <div className="min-h-screen pt-18">
      {/* Full-Page Loading Spinner */}
      {isLoading && <LoadingSpinner />}

      {/* Banner Carousel */}
      {isLoading ? (
        <BannerSkeleton />
      ) : (
        <div className="w-full h-[200px] xs:h-[250px] sm:h-[300px] md:h-[400px] lg:h-[500px] overflow-hidden shadow-md shadow-black/20">
          <div className="carousel w-full h-full relative">
            {["B2", "B1", "B3", "B4"].map((img, index) => (
              <div
                key={index}
                id={`slide${index + 1}`}
                className={`carousel-item absolute w-full h-full transition-opacity duration-500 ${
                  currentSlide === index ? "opacity-100" : "opacity-0"
                }`}
              >
                <img
                  src={`/image/${img}.jpg`}
                  className="w-full h-full object-cover"
                  alt={`Slide ${index + 1}`}
                  loading={index === 0 ? "eager" : "lazy"} // Eager load first slide
                />
                <div className="absolute inset-x-2 sm:inset-x-4 top-1/2 flex justify-between -translate-y-1/2">
                  <button
                    onClick={handlePrevSlide}
                    className="btn btn-circle bg-white text-black hover:bg-gray-200 w-8 h-8 min-h-[2rem] xs:w-10 xs:h-10 sm:w-12 sm:h-12 sm:min-h-[3rem]"
                    aria-label="Previous slide"
                  >
                    ❮
                  </button>
                  <button
                    onClick={handleNextSlide}
                    className="btn btn-circle bg-white text-black hover:bg-gray-200 w-8 h-8 min-h-[2rem] xs:w-10 xs:h-10 sm:w-12 sm:h-12 sm:min-h-[3rem]"
                    aria-label="Next slide"
                  >
                    ❯
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Featured Products */}
      <section className="w-full py-6 max-w-7xl mx-auto px-16">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 hover:underline">
          <Link to="/product">Featured Products</Link>
        </h2>
        {error && (
          <p className="text-red-500 text-center">Error loading products: {error}</p>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {isLoading
            ? [...Array(itemsPerPage)].map((_, index) => (
                <ProductCardSkeltons key={index} />
              ))
            : paginatedTopProducts.map((product) => (
                <ProductCard
                  products={product}
                  key={product?._id}
                  showDescription={false}
                />
              ))}
        </div>
        {/* Pagination for Featured Products */}
        {totalPagesTop > 1 && (
          <div className="flex justify-end mt-6">
            <nav aria-label="Pagination" className="flex items-center gap-2">
              <button
                className={`px-4 py-2 text-sm font-medium rounded-full border border-gray-300 transition-all duration-200 ${
                  currentPageTop === 1
                    ? "opacity-50 cursor-not-allowed bg-gray-100"
                    : "hover:bg-gray-100 hover:border-gray-400 active:bg-gray-200"
                }`}
                onClick={() => setCurrentPageTop((prev) => Math.max(prev - 1, 1))}
                disabled={currentPageTop === 1}
                aria-label="Previous page"
              >
                ❮
              </button>
              {(() => {
                const pages = [];
                const maxPagesToShow = 5;
                const halfRange = Math.floor(maxPagesToShow / 2);
                let startPage = Math.max(1, currentPageTop - halfRange);
                let endPage = Math.min(totalPagesTop, startPage + maxPagesToShow - 1);

                if (endPage - startPage + 1 < maxPagesToShow) {
                  startPage = Math.max(1, endPage - maxPagesToShow + 1);
                }

                if (startPage > 1) {
                  pages.push(
                    <button
                      key={1}
                      className={`px-4 py-2 text-sm font-medium rounded-full border border-gray-300 transition-all duration-200 ${
                        currentPageTop === 1
                          ? "bg-gray-800 text-white border-gray-800"
                          : "hover:bg-gray-100 hover:border-gray-400 active:bg-gray-200"
                      }`}
                      onClick={() => setCurrentPageTop(1)}
                      aria-label={`Page 1${currentPageTop === 1 ? ", current" : ""}`}
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

                for (let i = startPage; i <= endPage; i++) {
                  pages.push(
                    <button
                      key={i}
                      className={`px-4 py-2 text-sm font-medium rounded-full border border-gray-300 transition-all duration-200 ${
                        currentPageTop === i
                          ? "bg-gray-800 text-white border-gray-800"
                          : "hover:bg-gray-100 hover:border-gray-400 active:bg-gray-200"
                      }`}
                      onClick={() => setCurrentPageTop(i)}
                      aria-label={`Page ${i}${currentPageTop === i ? ", current" : ""}`}
                    >
                      {i}
                    </button>
                  );
                }

                if (endPage < totalPagesTop) {
                  if (endPage < totalPagesTop - 1) {
                    pages.push(
                      <span key="end-ellipsis" className="px-2 text-sm text-gray-500">
                        ...
                      </span>
                    );
                  }
                  pages.push(
                    <button
                      key={totalPagesTop}
                      className={`px-4 py-2 text-sm font-medium rounded-full border border-gray-300 transition-all duration-200 ${
                        currentPageTop === totalPagesTop
                          ? "bg-gray-800 text-white border-gray-800"
                          : "hover:bg-gray-100 hover:border-gray-400 active:bg-gray-200"
                      }`}
                      onClick={() => setCurrentPageTop(totalPagesTop)}
                      aria-label={`Page ${totalPagesTop}${
                        currentPageTop === totalPagesTop ? ", current" : ""
                      }`}
                    >
                      {totalPagesTop}
                    </button>
                  );
                }

                return pages;
              })()}
              <button
                className={`px-4 py-2 text-sm font-medium rounded-full border border-gray-300 transition-all duration-200 ${
                  currentPageTop === totalPagesTop
                    ? "opacity-50 cursor-not-allowed bg-gray-100"
                    : "hover:bg-gray-100 hover:border-gray-400 active:bg-gray-200"
                }`}
                onClick={() =>
                  setCurrentPageTop((prev) => Math.min(prev + 1, totalPagesTop))
                }
                disabled={currentPageTop === totalPagesTop}
                aria-label="Next page"
              >
                ❯
              </button>
            </nav>
          </div>
        )}
      </section>

      {/* Super Saver Offers */}
      <LazyLoad height={200} offset={100}>
        <section className="w-full py-2 max-w-7xl mx-auto px-4 sm:px-16">
          <h2 className="text-xl sm:text-2xl font-bold text-center mb-6">
            Super Saver Offers
          </h2>
          {isLoading ? (
            <div className="w-full h-[180px] sm:h-[220px] md:h-[280px] bg-gray-200 rounded-lg animate-pulse">
              <div className="w-full h-full relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-[shimmer_2s_infinite_linear]"></div>
              </div>
            </div>
          ) : (
            <img
              src="/image/bannerfull.gif"
              alt="Super Saver Offers"
              className="w-full h-[180px] sm:h-[220px] md:h-[280px] rounded-lg object-cover shadow-md"
              loading="lazy"
            />
          )}
        </section>
      </LazyLoad>

      {/* Browse by Category */}
      <LazyLoad height={200} offset={100}>
        <section className="w-full py-4 max-w-7xl mx-auto px-4 sm:px-16">
          <h2 className="text-xl sm:text-2xl font-bold text-center mb-6">
            Browse by Category
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            {isLoading
              ? [...Array(3)].map((_, idx) => (
                  <div
                    key={idx}
                    className="w-full h-[200px] sm:h-[250px] bg-gray-200 rounded-lg animate-pulse relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 animate-[shimmer_2s_infinite_linear]"></div>
                  </div>
                ))
              : [
                  { name: "Men", img: "/image/m1.jpg", path: "/product?category=Men" },
                  { name: "Kids", img: "/image/k1.jpg", path: "/product?category=Kids" },
                  { name: "Women", img: "/image/jas.png", path: "/product?category=Women" },
                ].map((cat, idx) => (
                  <Link key={idx} to={cat.path}>
                    <div className="group transition-transform duration-300 transform hover:scale-105 hover:shadow-lg rounded-lg overflow-hidden">
                      <img
                        src={cat.img}
                        alt={cat.name}
                        className="w-full h-[200px] sm:h-[250px] object-cover transition-transform duration-300"
                        loading="lazy"
                      />
                      <p className="mt-2 text-base sm:text-lg font-semibold text-center group-hover:underline">
                        {cat.name}
                      </p>
                    </div>
                  </Link>
                ))}
          </div>
        </section>
      </LazyLoad>

      {/* New Arrivals Section */}
      <LazyLoad height={200} offset={100}>
        <section className="w-full max-w-7xl mx-auto px-16">
          <h2 className="text-xl sm:text-2xl font-bold text-center mb-6">
            New Arrivals
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 justify-items-center">
            {isLoading
              ? [...Array(itemsPerPage)].map((_, index) => (
                  <ProductCardSkeltons key={index} />
                ))
              : paginatedNewArrivals.map((product) => (
                  <ProductCard
                    products={product}
                    key={product?._id}
                    showDescription={false}
                  />
                ))}
          </div>
          {/* Pagination for New Arrivals */}
          {totalPagesNewArrivals > 1 && (
            <div className="flex justify-end mt-6 mb-4">
              <nav aria-label="Pagination" className="flex items-center gap-2">
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
                {(() => {
                  const pages = [];
                  const maxPagesToShow = 5;
                  const halfRange = Math.floor(maxPagesToShow / 2);
                  let startPage = Math.max(1, currentPageNewArrivals - halfRange);
                  let endPage = Math.min(totalPagesNewArrivals, startPage + maxPagesToShow - 1);

                  if (endPage - startPage + 1 < maxPagesToShow) {
                    startPage = Math.max(1, endPage - maxPagesToShow + 1);
                  }

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
                <button
                  className={`px-4 py-2 text-sm font-medium rounded-full border border-gray-300 transition-all duration-200 ${
                    currentPageNewArrivals === totalPagesNewArrivals
                      ? "opacity-50 cursor-not-allowed bg-gray-100"
                      : "hover:bg-gray-100 hover:border-gray-400 active:bg-gray-200"
                  }`}
                  onClick={() =>
                    setCurrentPageNewArrivals((prev) => Math.min(prev + 1, totalPagesNewArrivals))
                  }
                  disabled={currentPageNewArrivals === totalPagesNewArrivals}
                  aria-label="Next page"
                >
                  ❯
                </button>
              </nav>
            </div>
          )}
        </section>
      </LazyLoad>
    </div>
  );
};