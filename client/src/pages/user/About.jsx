import React from "react";
import { motion } from "framer-motion";

// Testimonials Component
const Testimonials = () => {
  const reviews = [
    { name: "John D.", text: "Amazing quality and fast delivery!", rating: 5 },
    { name: "Sarah M.", text: "Loved the variety of products!", rating: 4 },
    { name: "Mike R.", text: "Great customer service!", rating: 5 },
  ];

  return (
    <section className="w-full py-8 max-w-7xl mx-auto px-4 sm:px-16 bg-base-100">
      <h2 className="text-xl sm:text-2xl font-bold text-center mb-6 tracking-tight text-base-content">
        What Our Customers Say
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {reviews.map((review, index) => (
          <div
            key={index}
            className="p-4 border border-base-300 rounded-lg shadow-sm hover:shadow-md transition bg-base-100"
          >
            <p className="text-sm italic mb-2 text-base-content">"{review.text}"</p>
            <p className="font-semibold text-base-content">{review.name}</p>
            <div className="flex gap-1">
              {[...Array(review.rating)].map((_, i) => (
                <svg
                  key={i}
                  className="w-4 h-4 text-yellow-500"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export const AboutUs = () => {
  // Animation Variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <div className="pt-24 bg-base-100 text-base-content min-h-screen p-6 md:p-12 lg:p-20 flex justify-center items-center">
      <div className="bg-base-100 p-6 md:p-10 lg:p-15 rounded-xl shadow-xl w-full max-w-6xl">
        {/* About Section */}
        <motion.div
          className="text-center mb-10"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <h1
            className="text-4xl md:text-5xl font-bold text-base-content"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            Z FASHION
          </h1>
          <p className="mt-6 text-base md:text-lg max-w-3xl mx-auto leading-relaxed text-base-content">
            At Z FASHION, we are dedicated to bringing you the latest trends in fashion with a focus on quality,
            comfort, and affordability. Whether you're looking for casual wear, formal attire, or something unique,
            our carefully curated collection for Men, Women, and Kids has something for everyone. Our commitment to
            sustainability and ethical sourcing ensures that you not only look good but also feel good about your
            fashion choices. Explore our styles and redefine your wardrobe with Z FASHION.
          </p>
          <motion.div
            className="flex justify-center mt-8"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <video
              className="w-full max-w-3xl rounded-xl object-contain"
              autoPlay
              loop
              muted
              playsInline
            >
              <source src="/image/VID 3.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </motion.div>
        </motion.div>

        {/* Cards Section */}
        <div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8"
          style={{ fontFamily: "Playfair Display, serif" }}
        >
          {[
            {
              title: "Our Vision",
              text: "We aim to set a global benchmark in fashion by blending style with sustainability, ensuring every piece tells a story of innovation and responsibility.",
              color: "bg-base-200",
            },
            {
              title: "Our Approach",
              text: "At Z FASHION, we believe in staying ahead of trends by embracing creativity and cutting-edge technology to design the future of fashion.",
              color: "bg-base-200",
            },
            {
              title: "Our Process",
              text: "From selecting premium fabrics to precise tailoring and rigorous quality checks, we ensure that every product meets the highest standards of craftsmanship.",
              color: "bg-base-200",
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeInUp}
              transition={{ delay: index * 0.2 }}
            >
              <div
                className={`p-6 rounded-2xl shadow-lg border border-base-300 ${item.color} text-base-content w-full`}
              >
                <h2 className="text-xl md:text-2xl font-semibold mb-3 text-center text-base-content">
                  {item.title}
                </h2>
                <p className="text-sm md:text-base leading-relaxed text-base-content">{item.text}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Testimonials */}
        <Testimonials />
      </div>
    </div>
  );
};