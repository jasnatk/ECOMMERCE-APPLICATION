export const SubHeader = ({ setSidebarOpen }) => {
    return (
      <div className="bg-white shadow p-4 sm:p-6 flex justify-between items-center">
        <div className="flex items-center">
          <button
            className="btn btn-square btn-ghost lg:hidden mr-3 sm:mr-4"
            onClick={() => setSidebarOpen(true)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="w-5 h-5 sm:w-6 sm:h-6 stroke-current"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <div className="text-lg sm:text-xl font-semibold"></div>
        </div>
        <div className="flex items-center space-x-3 sm:space-x-4">
          <input
            type="text"
            placeholder="Search..."
            className="input input-bordered input-sm sm:input-md rounded-lg px-3 py-1 w-32 sm:w-48"
          />
          <div className="flex items-center space-x-2">
            <img
              src="https://tse1.mm.bing.net/th/id/OIP.xngmei78BNsh21wH8xyj-wHaJ4?rs=1&pid=ImgDetMain"
              alt="Profile"
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full"
            />
            <span className="text-sm sm:text-base">Admin</span>
          </div>
        </div>
      </div>
    );
  };