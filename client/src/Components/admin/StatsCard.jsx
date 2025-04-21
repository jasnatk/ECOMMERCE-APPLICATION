const StatsCard = ({ title, value, icon, color }) => {
    return (
      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md flex items-center transition-transform hover:scale-[1.02]">
        <div className={`text-4xl mr-4 ${color}`}>{icon}</div>
        <div>
          <h3 className="text-sm sm:text-base text-gray-500 font-medium">{title}</h3>
          <p className="text-xl sm:text-2xl font-bold text-gray-800">{value}</p>
        </div>
      </div>
    );
  };
  
  export default StatsCard;