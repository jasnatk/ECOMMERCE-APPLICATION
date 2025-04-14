// pages/AdminDashboard.jsx
import { useEffect, useState } from "react";
import axios from "axios";

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [sellers, setSellers] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    const fetchData = async () => {
      const [ordersRes, productsRes, sellersRes] = await Promise.all([
        axios.get("/api/admin/orders", { headers: { Authorization: `Bearer ${token}` } }),
        axios.get("/api/admin/products", { headers: { Authorization: `Bearer ${token}` } }),
        axios.get("/api/admin/sellers", { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      setOrders(ordersRes.data);
      setProducts(productsRes.data);
      setSellers(sellersRes.data);
    };

    fetchData();
  }, []);

  const verifyProduct = async (productId) => {
    const token = localStorage.getItem("token");
    await axios.put(`/api/admin/products/${productId}/verify`, {}, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setProducts(products.filter(p => p._id !== productId));
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Admin Dashboard</h1>

      <section className="mb-6">
        <h2 className="text-lg font-semibold">🛒 Orders</h2>
        <ul>
          {orders.map(order => (
            <li key={order._id}>
              Order #{order._id} - {order.status} - {order.user?.name}
            </li>
          ))}
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-lg font-semibold">📝 Products Awaiting Verification</h2>
        <ul>
          {products.map(product => (
            <li key={product._id} className="flex items-center justify-between">
              <span>{product.name} - {product.seller?.name}</span>
              <button
                className="bg-green-500 text-white px-2 py-1 rounded"
                onClick={() => verifyProduct(product._id)}
              >
                Verify
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-lg font-semibold">👤 Sellers</h2>
        <ul>
          {sellers.map(seller => (
            <li key={seller._id}>{seller.name} - {seller.email}</li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default AdminDashboard;
