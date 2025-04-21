import { useState } from 'react';
import StatsCard from './StatsCard';
import { Link, useNavigate } from "react-router-dom";
import { SubHeader } from './SubHeader';
import Sidebar from './Sidebar';

export const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Main Content */}
      <div className="flex-1 lg:ml-64 transition-all duration-300">
        <SubHeader setSidebarOpen={setSidebarOpen} />
        <main className="p-4 sm:p-6 lg:p-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <StatsCard
              title="Total Sales"
              value="12,345"
              icon="💰"
              color="text-green-600"
            />
            <StatsCard
              title="New Orders"
              value="24"
              icon="📦"
              color="text-blue-600"
            />
            <StatsCard
              title="Customers"
              value="1,234"
              icon="👥"
              color="text-purple-600"
            />
           <StatsCard
             title={
             <Link to="/admin/manage-sellers" className="hover:text-gray-300 underline">
            All Sellers
           </Link>
          }
          value="32"
          icon="💰"
            color="text-green-600"
/>

          </div>
        </main>
      </div>
    </div>
  );
};