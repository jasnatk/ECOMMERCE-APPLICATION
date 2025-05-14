import React, { useRef } from "react";
import emailjs from "@emailjs/browser";
import { FaPhoneAlt } from "react-icons/fa";
import { PiBuildingOfficeFill } from "react-icons/pi";
import { AiOutlineMail } from "react-icons/ai";
import { toast } from "react-hot-toast";

export const ContactUs = () => {
  const form = useRef();

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm("service_y4yjf7l", "template_d5mro2j", form.current, "KrQquvjPTrlTouiMb")
      .then(
        (result) => {
          console.log(result.text);
          toast.success("Message sent successfully!");
          e.target.reset();
        },
        (error) => {
          console.log(error.text);
          toast.error("Something went wrong. Please try again.");
        }
      );
  };

  return (
    <div className="bg-base-100 text-base-content min-h-screen p-6 flex flex-col items-center pt-24">
      <div className="w-full max-w-4xl mb-6">
        <video
          className="w-full h-60 object-cover rounded-xl"
          autoPlay
          loop
          muted
          playsInline
        >
          <source src="/image/vid2.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>

      <div className="w-full max-w-4xl bg-base-100 p-6 md:p-8 rounded-xl shadow-xl grid md:grid-cols-2 gap-6">
        {/* Left - Contact Info */}
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold text-base-content">Contact Information</h2>

          <div className="flex gap-3">
            <PiBuildingOfficeFill className="w-5 h-5 mt-1 text-base-content" />
            <div className="text-sm text-base-content">
              <p>Z FASHION Pvt. Ltd.</p>
              <p>2nd Fashion Street</p>
              <p>Downtown City</p>
              <p>Country - 001</p>
            </div>
          </div>

          <div className="flex gap-3">
            <FaPhoneAlt className="w-4 h-5 mt-1 text-base-content" />
            <div className="text-sm text-base-content">
              <p>+1 (234) 567-890</p>
              <p>+1 (987) 654-321</p>
              <p>+1 (555) 123-456</p>
            </div>
          </div>

          <div className="flex gap-3">
            <AiOutlineMail className="w-5 h-5 mt-1 text-base-content" />
            <div className="text-sm text-base-content">
              <p>support@zfashion.com</p>
              <p>info@zfashion.com</p>
              <p>help@zfashion.com</p>
            </div>
          </div>
        </div>

        {/* Right - Contact Form */}
        <form ref={form} onSubmit={sendEmail}>
          <h2 className="text-xl font-semibold text-base-content mb-4">Send a Message</h2>

          <div className="grid grid-cols-2 gap-4">
            <input
              name="first_name"
              type="text"
              placeholder="First Name"
              required
              className="p-2 border border-base-300 rounded-md text-sm bg-base-100 text-base-content placeholder-base-content/50"
            />
            <input
              name="last_name"
              type="text"
              placeholder="Last Name"
              required
              className="p-2 border border-base-300 rounded-md text-sm bg-base-100 text-base-content placeholder-base-content/50"
            />
          </div>

          <input
            name="address"
            type="text"
            placeholder="Address"
            required
            className="mt-4 p-2 w-full border border-base-300 rounded-md text-sm bg-base-100 text-base-content placeholder-base-content/50"
          />

          <div className="grid grid-cols-2 gap-4 mt-4">
            <input
              name="city"
              type="text"
              placeholder="City"
              required
              className="p-2 border border-base-300 rounded-md text-sm bg-base-100 text-base-content placeholder-base-content/50"
            />
            <input
              name="state"
              type="text"
              placeholder="State"
              required
              className="p-2 border border-base-300 rounded-md text-sm bg-base-100 text-base-content placeholder-base-content/50"
            />
          </div>

          <input
            name="email"
            type="email"
            placeholder="Email"
            required
            className="mt-4 p-2 w-full border border-base-300 rounded-md text-sm bg-base-100 text-base-content placeholder-base-content/50"
          />

          <textarea
            name="message"
            rows="3"
            placeholder="Your message"
            required
            className="mt-4 p-2 w-full border border-base-300 rounded-md text-sm bg-base-100 text-base-content placeholder-base-content/50"
          ></textarea>

          <button
            type="submit"
            className="bg-teal-600 text-white text-sm p-2 rounded-md w-full mt-4 hover:bg-indigo-700 transition-all duration-200"
          >
            Submit Message
          </button>
        </form>
      </div>
    </div>
  );
};