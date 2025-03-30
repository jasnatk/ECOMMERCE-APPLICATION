import React from 'react';
import ProductCard from '../../Components/user/Cards';
import { ProductCardSkeltons } from '../../Components/user/Skeltons';
import { useFetch } from '../../hooks/useFetch';

export const Product = () => {
  const [productList, isLoading, error] = useFetch("/product/productList");

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold text-center mb-6" style={{ fontFamily: "Playfair Display, serif" }}>Shop the Latest Fashion Trends

</h1>

      {error && <p className="text-red-500 text-center">Error loading products</p>}

      {/* Grid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {isLoading
          ? // Show Skeletons when loading
            [...Array(8)].map((_, index) => <ProductCardSkeltons key={index} />)
          : // Show Products when loaded
            productList?.map((value) => <ProductCard products={value} key={value?._id} />)}
      </div>
    </div>
  );
};

