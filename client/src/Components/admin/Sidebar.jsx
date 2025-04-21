import { useState } from 'react';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const menuItems = [
    { name: 'Dashboard', icon: '🏠' },
    { name: 'Products', icon: '🛍️' },
    { name: 'Orders', icon: '📦' },
    { name: 'Customers', icon: '👥' },
    { name: 'Analytics', icon: '📊' },
    { name: 'Settings', icon: '⚙️' },
  ];

  return (
    <>
      {/* Sidebar for mobile view */}
      <div className={`lg:hidden drawer ${isOpen ? 'drawer-open' : ''}`}>
        <input id="sidebar-toggle" type="checkbox" className="drawer-toggle" checked={isOpen} onChange={() => setIsOpen(!isOpen)} />
        <div className="drawer-side z-40">
          <label htmlFor="sidebar-toggle" className="drawer-overlay" onClick={() => setIsOpen(false)}></label>
          <div className="w-64 bg-gray-800 text-white h-full p-4 sm:p-6">
            <div className="text-xl sm:text-2xl font-bold mb-6">Z FASHION</div>
            <nav>
              {menuItems.map((item) => (
                <a
                  key={item.name}
                  href="#"
                  className="flex items-center p-3 rounded-lg hover:bg-gray-700 transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  <span className="text-xl mr-3">{item.icon}</span>
                  <span className="text-sm sm:text-base">{item.name}</span>
                </a>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Sidebar for desktop view */}
      <div className="hidden lg:block w-64 bg-gray-800 text-white h-screen fixed top-0 left-0 p-4 sm:p-6">
        <div className="text-xl sm:text-2xl font-bold mb-6">Z FASHION</div>
        <nav>
          {menuItems.map((item) => (
            <a
              key={item.name}
              href="#"
              className="flex items-center p-3 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <span className="text-xl mr-3">{item.icon}</span>
              <span className="text-sm sm:text-base">{item.name}</span>
            </a>
          ))}
        </nav>
      </div>
    </>
  );
};

export default Sidebar;