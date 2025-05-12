import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
export const Footer = () => {
  const location = useLocation();

  // Scroll to the top whenever the location changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  return (
    <footer className="footer sm:footer-horizontal bg-base-200 text-base-content p-10">
      <aside>
        <div className="mt-[35px]">
          <Link to="/product" className="hover:text-gray-500 text-4xl tracking-wide" style={{ fontFamily: 'Playfair Display, serif' }}>
            Z FASHION
          </Link>
        </div>
      </aside>

      <nav>
        <h6 className="footer-title">categories</h6>
        <Link to="/product?category=Men" className="link link-hover">MEN</Link>
        <Link to="/product?category=Women" className="link link-hover">WOMEN</Link>
        <Link to="/product?category=Kids" className="link link-hover">KIDS</Link>
      </nav>

      <nav>
        <h6 className="footer-title">SUPPORT</h6>
        <Link to="/contact" className="link link-hover">Contact</Link>
        <Link to="/about" className="link link-hover">About Us</Link>
        <Link to="/seller/login" className="link link-hover">Sell on Z Fashion</Link>
      </nav>

      <nav>
        <h6 className="footer-title">Keep in Touch</h6>
        <div className="grid grid-flow-col gap-4">
        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="fill-current hover:fill-gray-300 transition-colors duration-200">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
              </svg>
            </a>
          
          <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="fill-current">
              <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"></path>
            </svg>
          </a>
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="fill-current">
              <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"></path>
            </svg>
          </a>
        </div>

        <form className="flex mt-2">
          <input
            type="email"
            placeholder="Enter your email"
            className="p-1 text-sm border rounded-l text-black bg-white w-40"
          />
          <button
            type="submit"
            className="bg-gray-500 text-white p-1 text-sm rounded-r hover:bg-gray-600"
          >
            Subscribe
          </button>
        </form>
      </nav>
    </footer>
  );
};
