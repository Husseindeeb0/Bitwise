import { FaInstagram, FaWhatsapp, FaYoutube } from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="text-white py-5 px-4">
      <div className="container bg-navy-blue p-5 mx-auto max-w-4xl rounded-2xl">
        <div className="flex flex-wrap justify-between items-start gap-4">
          {/* Logo & Description */}
          <div className="w-full sm:w-auto max-w-xs mb-4 sm:mb-0">
            <div className="flex items-center space-x-3">
              <img src="/logo.png" alt="Bitwise Logo" className="h-10" />
              <p className="text-sm text-gray-300">
                Bitwise – Your go-to platform for tech solutions & innovation.
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col space-y-1 text-sm">
            <Link to="/" className="hover:text-gray-400 underline">
              Home
            </Link>
            <Link to="/announcements" className="hover:text-gray-400 underline">
              Announcements
            </Link>
          </div>

          {/* Contact Info */}
          <div className="text-sm">
            <p className="font-semibold mb-1">Contact Us</p>
            <p className="text-gray-300">
              <span className="font-bold">Email: </span>
              <a
                href="mailto:bitwiseclub.lu@gmail.com"
                className="hover:underline"
              >
                bitwiseclub.lu@gmail.com
              </a>
            </p>
            <p className="text-gray-300">
              <span className="font-bold">Phone: </span>
              <a
                href="tel:+96176764155"
                className="text-gray-200 hover:underline"
              >
                +961 76 764 155
              </a>
            </p>
          </div>
        </div>

        <hr className="my-4 opacity-30" />

        {/* Bottom Section */}
        <div className="flex flex-wrap justify-between items-center text-sm text-gray-300">
          {/* Social Media Icons */}
          <div className="flex space-x-4 text-lg mb-2 sm:mb-0">
            <a
              href="https://www.instagram.com/bitwise_club?igsh=MW11MXIzNzVIejU5Z"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-pink-500 transition duration-300"
            >
              <FaInstagram />
            </a>
            <a
              href="https://chat.whatsapp.com/BRfuyGdNezzD50dGmLL"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-green-500 transition duration-300"
            >
              <FaWhatsapp />
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-red-500 transition duration-300"
            >
              <FaYoutube />
            </a>
          </div>

          {/* Copyright */}
          <div>© {new Date().getFullYear()} Bitwise. All rights reserved.</div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

{
  /* Newsletter Signup */
}
{
  /* <div className="mt-4 md:mt-0">
          <p className="font-semibold mb-2">Subscribe to Our Newsletter</p>
          <form className="flex">
            <input
              type="email"
              placeholder="Enter your email"
              className="px-3 py-2 rounded-l-lg bg-white text-black focus:outline-none"
            />
            <button
              type="submit"
              className="bg-dark-purple hover:bg-sky-blue px-4 py-2 rounded-r-lg text-white transition duration-300"
            >
              Subscribe
            </button>
          </form>
        </div> */
}

{
  /* Feedback Button */
}
{
  /* <Link
            to="/feedback"
            className="bg-light-purple hover:bg-dark-purple px-4 py-2 rounded-lg text-white transition duration-300"
          >
            Send Feedback
          </Link> */
}
