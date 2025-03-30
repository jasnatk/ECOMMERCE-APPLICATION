import React from "react";
import { useFetch } from "../../hooks/useFetch";

export const CartPage = () => {
    const [cartData, isLoading, error] = useFetch("/cart/get-cart-details");
    const errorMessage = error?.response?.data?.message || "unable to fetch cart";

    console.log("cartData====", cartData);

    console.log(error?.response?.data?.message);

    if (error) return <p>{errorMessage} </p>;

    return (
        <div>
            <div className="flex gap-20  ">
                <div className="w-8/12">
                    {cartData?.courses?.map((value) => (
                        <div className="flex items-center gap-5 bg-accent-content my-5 ">
                            <img className=" h-20 " src={value?.courseId?.image} alt="course img" />
                            <h3>{value?.courseId?.title}</h3>
                            <h3>{value?.courseId?.price}</h3>
                        </div>
                    ))}
                </div>
                <div className="w-4/12 flex text-center bg-secondary">
                    <h1>Payment Details</h1>
                </div>
            </div>

            <button className="btn btn-success">Check out </button>
        </div>
    );
};