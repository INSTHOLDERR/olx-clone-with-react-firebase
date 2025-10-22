import React from "react";
import { FaFacebookF, FaInstagram, FaYoutube, FaTwitter, FaWhatsapp, FaLinkedinIn } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="mt-10 text-gray-700 bg-gray-100">
      <div className="grid grid-cols-1 gap-8 px-5 py-10 mx-auto max-w-7xl sm:grid-cols-2 md:grid-cols-4">
        
        {/* Popular Locations */}
        <div>
          <h2 className="mb-4 text-lg font-semibold">Popular Locations</h2>
          <ul className="space-y-2">
            <li>Kolkata</li>
            <li>Mumbai</li>
            <li>Chennai</li>
            <li>Pune</li>
          </ul>
        </div>

        {/* Trending Locations */}
        <div>
          <h2 className="mb-4 text-lg font-semibold">Trending Locations</h2>
          <ul className="space-y-2">
            <li>Bhubaneshwar</li>
            <li>Hyderabad</li>
            <li>Chandigarh</li>
            <li>Nashik</li>
          </ul>
        </div>

        {/* About Us */}
        <div>
          <h2 className="mb-4 text-lg font-semibold">About Us</h2>
          <ul className="space-y-2">
            <li>Tech@OLX</li>
            <li>Careers</li>
          </ul>
        </div>

        {/* OLX */}
        <div>
          <h2 className="mb-4 text-lg font-semibold">OLX</h2>
          <ul className="space-y-2">
            <li>Blog</li>
            <li>Help</li>
            <li>Sitemap</li>
            <li>Legal & Privacy Information</li>
            <li>Vulnerability Disclosure Program</li>
          </ul>
        </div>
      </div>

      <div className="flex flex-col items-center justify-between px-5 py-6 mx-auto border-t border-gray-300 max-w-7xl md:flex-row">
        {/* Social Media */}
        <div className="flex gap-4 mb-4 md:mb-0">
          <a href="#" className="hover:text-teal-600"><FaFacebookF /></a>
          <a href="#" className="hover:text-teal-600"><FaInstagram /></a>
          <a href="#" className="hover:text-teal-600"><FaYoutube /></a>
          <a href="#" className="hover:text-teal-600"><FaTwitter /></a>
          <a href="#" className="hover:text-teal-600"><FaWhatsapp /></a>
          <a href="#" className="hover:text-teal-600"><FaLinkedinIn /></a>
        </div>

        {/* Download Links */}
        <div className="flex flex-col gap-4 text-sm sm:flex-row">
          <a href="#" className="px-4 py-2 text-white bg-black rounded-md hover:bg-gray-800">
            Download OLX for Android
          </a>
          <a href="#" className="px-4 py-2 text-white bg-black rounded-md hover:bg-gray-800">
            Download OLX for iOS
          </a>
        </div>
      </div>

      <div className="py-4 text-sm text-center text-gray-500">
        © {new Date().getFullYear()} OLX. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
