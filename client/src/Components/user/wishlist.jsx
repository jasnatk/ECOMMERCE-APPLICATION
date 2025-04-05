import React, { useEffect, useState } from 'react';
import { FaTrashAlt, FaShoppingCart } from 'react-icons/fa';
import { axiosInstance } from '../../config/axiosInstance';
import { useNavigate } from 'react-router-dom';
import { ProductCard } from './Cards';  // Importing your ProductCard component

export const WishlistPage = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        // API call to backend for wishlist data
        const res = await axiosInstance.get('/wishlist/getAll', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        const products = res.data.data?.products || [];
        setWishlist(products);
      } catch (error) {
        console.error('Error fetching wishlist:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, []);

  const handleRemove = async (productId) => {
    try {
      await axiosInstance.delete(`/wishlist/remove/${productId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setWishlist(wishlist.filter((product) => product.product_id._id !== productId));
    } catch (error) {
      console.error('Error removing product from wishlist:', error);
    }
  };

  const handleAddToCart = async (productId) => {
    try {
      // Assuming your backend has an API to add products to the cart
      await axiosInstance.post('/cart/add', { productId }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      console.log('Product added to cart!');
    } catch (error) {
      console.error('Error adding product to cart:', error);
    }
  };

  if (loading) return <p className="text-center text-xl">Loading...</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Your Wishlist</h1>

      {wishlist.length === 0 ? (
        <p className="text-center text-xl"> is empty!</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {wishlist.map((item) => (
            <div key={item.product_id} className="bg-white shadow-md rounded-lg overflow-hidden">
              <ProductCard products={item.product_id} showDescription={false} />
              <div className="p-4">
                <div className="flex justify-between items-center space-x-2">
                  
                  {/* Remove button */}
                  <button
  className="flex items-center bg-red-800 text-white py-2 px-4 rounded-lg justify-center hover:bg-red-700 w-full"
  onClick={() => handleRemove(item.product_id._id)}
>
  <FaTrashAlt className="mr-2" />
  Remove
</button>

                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
