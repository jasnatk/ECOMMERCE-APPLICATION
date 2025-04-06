import React, { useState } from "react";
import { useFetch } from "../../hooks/useFetch";
import { axiosInstance } from "../../config/axiosInstance";
import { useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { FaTrashAlt } from "react-icons/fa"; 
import toast from "react-hot-toast"; 

export const CartPage = () => {
    const [cartData, isLoading, error, refetch] = useFetch("/cart/getCart");
    const errorMessage = error?.response?.data?.message || "Unable to fetch cart";
    const [isCartEmpty, setIsCartEmpty] = useState(false);
    const navigate = useNavigate(); 

    // Refetch cart data after clearing cart or removing an item
    const handleClearCart = async () => {
        try {
            await axiosInstance.delete("/cart/clearCart");
            setIsCartEmpty(true);
            refetch(); // Refresh the cart after it's cleared
            toast.success("Cart cleared successfully!");
        } catch (err) {
            console.error("Failed to clear cart:", err?.response?.data?.message || err.message);
            toast.error("Failed to clear the cart."); 
        }
    };

    const handleRemove = async (productId) => {
        try {
            const response = await axiosInstance({
                method: "PUT",
                url: "cart/removeFromCart",
                data: { productId },
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });

            // Call refetch to refresh the cart after removal
            refetch(); // Trigger the re-fetch using the fetchData function from useFetch
            toast.success("Product removed from cart!"); // Success notification
        } catch (error) {
            console.error("Failed to remove product from cart:", error);
            toast.error(error?.response?.data?.message || "Unable to remove product from cart"); // Error notification
        }
    };
    const makePayment = async () => {
        try {
            const stripe = await loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

            const session = await axiosInstance({
                url: "/payment/create-checkout-session",
                method: "POST",
                data: { products: cartData?.products },
            });

            console.log(session, "=======session");
            const result = stripe.redirectToCheckout({
                sessionId: session.data.sessionId,
            });
        } catch (error) {
            console.log(error);
        }
    };




    // If there's an error or cart is loading, show respective messages
    if (error) return <p className="text-red-500 text-center mt-10">{errorMessage}</p>;
    if (isLoading) return <p className="text-center mt-10">Loading cart...</p>;

    // If cart is empty
    if ((cartData?.products?.length === 0 && !isCartEmpty) || isCartEmpty) {
        return (
            <div className="p-8 ">
                <h2 className="text-3xl font-bold w-full text-center mb-6">Your Shopping Cart</h2>
                <p className="text-lg text-gray-500">Your cart is empty.</p>
                <button
                    onClick={() => navigate("/product")} // Navigate to homepage
                    className="mt-4 bg-black text-white py-2 px-4 rounded-lg hover:bg-gray-800"
                >
                    Continue Shopping
                </button>
            </div>
        );
    }

    return (
        <div className="p-8">
            <div className="w-full ">
                <h2 className="text-3xl font-bold mb-6 text-center">Your Shopping Cart</h2>
            </div>

            {cartData?.products?.length > 0 && (
                <div className="flex justify-end py-8 text-5xl font-bold ">
                    <button
                        onClick={handleClearCart}
                        className="text-sm text-red-500 hover:underline ml-4 whitespace-nowrap"
                    >
                        Clear Cart
                    </button>
                </div>
            )}

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Cart Items Section */}
                <div className="w-full lg:w-8/12   bg-white dark:bg-gray-500 ">
                    <div className="bg-white shadow-md rounded-lg overflow-hidden ">
                        <div className="flex justify-between items-center bg-gray-100 p-4">
                            <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr] font-semibold text-lg w-full">
                                <div>Item</div>
                                <div>Price</div>
                                <div>Quantity</div>
                                <div>Total</div>
                            </div>
                        </div>

                        {cartData?.products?.map((item, index) => (
                            <div key={index} className="grid grid-cols-[2fr_1fr_1fr_1fr_1fr] items-center gap-4 p-4 border-t">
                                {/* Item */}
                                <div className="flex items-center ">
                                    <img
                                        className="h-20 w-20 object-cover rounded-md"
                                        src={item?.productId?.image}
                                        alt={item?.productId?.name}
                                    />
                                    <span className="font-medium">{item?.productId?.name}</span>
                                </div>

                                {/* Price */}
                                <div>₹{item?.productId?.price}</div>

                                {/* Quantity */}
                                <div>1</div> {/* Replace with actual quantity if available */}

                                {/* Total */}
                                <div>₹{item?.productId?.price}</div>

                                {/* Remove */}
                                <div
                                    className="flex items-center text-black py-2 px-4 rounded-lg justify-center hover:text-red-600 cursor-pointer"
                                    onClick={() => handleRemove(item?.productId?._id)}
                                >
                                    <FaTrashAlt className="mr-2" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Payment Details Section */}
                <div className="w-full lg:w-4/12 bg-gray-100 p-6 rounded-xl shadow-md h-fit">
                    <h3 className="text-xl font-bold mb-4">Payment Summary</h3>
                    <div className="flex justify-between mb-2">
                        <span>Total Items:</span>
                        <span>{cartData?.products?.length || 0}</span>
                    </div>
                    <div className="flex justify-between mb-2 font-semibold">
                        <span>Total Price:</span>
                        <span>
                            ₹
                            {cartData?.products?.reduce(
                                (total, item) => total + item?.productId?.price, 0
                            )}
                        </span>
                    </div>
                    <button
                    className="w-full mt-6 bg-green-800 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition"
                    disabled={cartData?.products?.length === 0} // Disable if cart is empty
                    onClick={makePayment} // Trigger payment function on click
                    >
                  Proceed to Checkout
                </button>

                </div>
            </div>
        </div>
    );
};
