import logo from "../../assets/logo.png";
import { FaInstagram, FaWhatsapp, FaYoutube } from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-navy-blue text-white py-8 px-6">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-start md:items-center">
        {/* Logo & Description */}
        <div className="mb-6 md:mb-0 max-w-xs">
          <img src={logo} alt="Bitwise Logo" className="h-12 mb-2 mx-auto" />
          <p className="text-sm text-gray-300">
            Bitwise – Your go-to platform for tech solutions & innovation.
          </p>
        </div>

        {/* Quick Links */}
        <div className="flex flex-col space-y-2 text-sm">
          <Link to="/" className="hover:text-gray-400">
            Home
          </Link>
          <Link to="/announcements" className="hover:text-gray-400">
            Announcements
          </Link>
        </div>

        {/* Contact Info */}
        <div className="text-sm">
          <p className="font-semibold">Contact Us</p>
          <p className="text-gray-300 space-x-2">
            <span>Email:</span>
            <a
              href="mailto:support@bitwise.com"
              className="text-light-purple hover:underline"
            >
              support@bitwise.com
            </a>
          </p>
          <p className="text-gray-300 space-x-2">
            <span>Phone:</span>
            <a
              href="tel:+123456789"
              className="text-light-purple hover:underline"
            >
              +123 456 789
            </a>
          </p>
        </div>

        {/* Newsletter Signup */}
        <div className="mt-4 md:mt-0">
          <p className="font-semibold mb-2">Subscribe to Our Newsletter</p>
          <form className="flex">
            <input
              type="email"
              placeholder="Enter your email"
              className="px-3 py-2 rounded-l-lg bg-white text-black focus:outline-none"
            />
            <button
              type="submit"
              className="bg-light-purple hover:bg-dark-purple px-4 py-2 rounded-r-lg text-white transition duration-300"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>
      <hr className="my-5" />

      <div className="mt-6 px-5 text-center text-sm text-gray-300 flex justify-between items-center">
        {/* Social Media Links */}
        <div className="flex space-x-6 text-xl">
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaInstagram className="hover:text-pink-500 transition duration-300" />
          </a>
          <a
            href="https://wa.me/yourwhatsappnumber"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaWhatsapp className="hover:text-green-500 transition duration-300" />
          </a>
          <a
            href="https://youtube.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaYoutube className="hover:text-red-500 transition duration-300" />
          </a>
        </div>

        {/* Copyright Section */}
        <span>© {new Date().getFullYear()} Bitwise. All rights reserved.</span>

        {/* Feedback Button */}
        <Link
          to="/feedback"
          className="bg-light-purple hover:bg-dark-purple px-4 py-2 rounded-lg text-white transition duration-300"
        >
          Give Feedback
        </Link>
      </div>
    </footer>
  );
};

export default Footer;
