import React, { useEffect, useState } from "react";
import { axiosInstance } from "../../config/axiosInstance";
import toast from "react-hot-toast";

const ManageSellers = () => {
  const [sellers, setSellers] = useState([]);
  useEffect(() => {
    const fetchSellers = async () => {
      try {
        const res = await axiosInstance.get("/admin/sellers");
        console.log("Response data:", res.data);
        setSellers(res.data.sellers || []);
      } catch (err) {
        toast.error("Failed to fetch sellers");
        console.error("Fetch error:", err);
      }
    };
  
    fetchSellers();
  }, []);
  

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">All Sellers</h2>
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="bg-blue-100">
              <th className="py-2 px-4 border">Name</th>
              <th className="py-2 px-4 border">Email</th>
              <th className="py-2 px-4 border">Joined On</th>
              <th className="py-2 px-4 border">Status</th>
            </tr>
          </thead>
          <tbody>
            {sellers.map((seller) => (
              <tr key={seller._id} className="text-center hover:bg-gray-100">
                <td className="py-2 px-4 border">{seller.name}</td>
                <td className="py-2 px-4 border">{seller.email}</td>
                <td className="py-2 px-4 border">{new Date(seller.createdAt).toLocaleDateString()}</td>
                <td className="py-2 px-4 border">{seller.isVerified ? "Verified" : "Pending"}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {sellers.length === 0 && <p className="p-4 text-gray-500 text-center">No sellers found.</p>}
      </div>
    </div>
  );
};

export default ManageSellers;
