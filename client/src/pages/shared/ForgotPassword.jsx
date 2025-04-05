import React from "react";
import { useForm } from "react-hook-form";
import emailjs from "@emailjs/browser";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export const ForgotPassword = () => {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      // EmailJS configuration
      const serviceID = "service_y4yjf7l";
      const templateID = "template_c8bny5i";
      const userID = "KrQquvjPTrlTouiMb";

      // Build the password reset link (use your actual domain or localhost)
      const resetLink = `http://localhost:5173/reset-password?email=${encodeURIComponent(
        data.email
      )}`;

      // Data passed to the EmailJS template
      const emailData = {
        email: data.email,
        link: resetLink,
      };

      // Send email through EmailJS
      const response = await emailjs.send(serviceID, templateID, emailData, userID);

      if (response.status === 200) {
        toast.success("Password reset link sent to your email");
        navigate("/login");
      }
    } catch (error) {
      toast.error("Something went wrong. Try again!");
      console.error(error);
    }
  };

  return (
    <div className="flex items-center justify-center bg-base-200 py-10 px-4 min-h-screen">
      <div className="bg-white shadow-2xl rounded-lg w-full max-w-md p-8 space-y-6">
        <h1 className="text-3xl font-bold text-center">Forgot Password</h1>
        <p className="text-center text-gray-600">
          Enter your email and we’ll send you a password reset link.
        </p>

        <form
          className="flex flex-col items-center space-y-6 w-full"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="w-full">
            <input
              type="email"
              placeholder="Enter your registered email"
              {...register("email")}
              required
              className="w-full h-12 p-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <button
            type="submit"
            className="w-full h-12 bg-black text-white rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black"
          >
            Send Reset Link
          </button>
        </form>

        <div className="text-sm text-center text-gray-600">
          <span>Remember your password? </span>
          <button
            onClick={() => navigate("/login")}
            className="text-black hover:underline"
          >
            Go to Login
          </button>
        </div>
      </div>
    </div>
  );
};
