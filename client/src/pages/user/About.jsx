import React from "react";
import { motion } from "framer-motion";

export const AboutUs = () => {
  return (
    <div className="bg-gray-100 text-gray-900 min-h-screen p-20 flex justify-center items-center">
      <div className="bg-white p-15 rounded-xl shadow-xl w-full max-w-4xl">
        {/* About Section */}
        <div className="text-center mb-10">
          <h1 className="text-5xl font-bold text-black" style={{ fontFamily: 'Playfair Display, serif' }}> Z FASHION</h1>
          <p className="mt-6 text-lg max-w-3xl mx-auto leading-relaxed text-gray-800">
            At Z FASHION, we are dedicated to bringing you the latest trends in fashion with a focus on quality,
            comfort, and affordability. Whether you're looking for casual wear, formal attire, or something unique,
            our carefully curated collection for Men, Women, and Kids has something for everyone.
            Our commitment to sustainability and ethical sourcing ensures that you not only look good but also feel good
            about your fashion choices. Explore our styles and redefine your wardrobe with Z FASHION.
          </p>
          <div className="flex justify-center mt-8">
          <video
          className="w-auto max-w-full object-contain rounded-xl"
          autoPlay
          loop
          muted
          playsInline
        >
          <source src="/image/VID 3.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
          </div>
        </div>

        {/* Cards Section */}
        <div className="grid md:grid-cols-3 gap-8"style={{ fontFamily: 'Playfair Display, serif' }}>
          {[ 
            { 
              title: "Our Vision", 
              text: "We aim to set a global benchmark in fashion by blending style with sustainability, ensuring every piece tells a story of innovation and responsibility.",
              color: "bg-gray-200" 
            },
            { 
              title: "Our Approach", 
              text: "At Z FASHION, we believe in staying ahead of trends by embracing creativity and cutting-edge technology to design the future of fashion.",
               
               color: "bg-gray-200" 
            },
            { 
              title: "Our Process", 
              text: "From selecting premium fabrics to precise tailoring and rigorous quality checks, we ensure that every product meets the highest standards of craftsmanship.",
              // color: "bg-orange-100" 
              color: "bg-gray-200" 
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <div className={`p-6 rounded-2xl shadow-lg border border-gray-300 text-white ${item.color} w-full max-w-xs`}>
                <h2 className="text-2xl font-semibold mb-3 text-center text-black">{item.title}</h2>
                <p className="text-black leading-relaxed">{item.text}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
