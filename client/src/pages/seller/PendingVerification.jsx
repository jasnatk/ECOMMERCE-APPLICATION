import React from "react";
import { motion } from "framer-motion";
import { FiClock } from "react-icons/fi";
import { useNavigate } from "react-router-dom";

const PendingVerification = () => {
    const navigate = useNavigate();
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900"
    >
      <div className="bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-xl shadow-lg text-center max-w-md">
        <FiClock className="text-4xl sm:text-5xl text-yellow-500 mx-auto mb-4" />
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white mb-4">
          Account Pending Verification
        </h2>
        <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-6">
          Your seller account is currently under review. You will be notified once your account is verified. 
        </p>
        <button
        onClick={() => navigate("/seller/login")}
          className="px-4 sm:px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-all duration-200"
        >
          Back to Login
        </button>
      </div>
    </motion.div>
  );
};

export default PendingVerification;