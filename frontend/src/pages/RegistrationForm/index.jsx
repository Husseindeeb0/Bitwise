import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { FaExclamationCircle, FaClipboard, FaCheck } from "react-icons/fa";
import Loader from "../../components/Loader";

const RegistrationForm = () => {
  const location = useLocation();
  const [formUrl, setFormUrl] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Get URL from query parameters
    const params = new URLSearchParams(location.search);
    const url = params.get("formUrl");

    // Validate URL
    if (!url) {
      setError("No registration form URL provided");
      setLoading(false);
      return;
    }

    // Check if it's a valid Google Forms URL
    if (!url.includes("docs.google.com/forms") && !url.includes("forms.gle")) {
      setError("Invalid form URL. Only Google Forms are supported.");
      setLoading(false);
      return;
    }

    // Set the form URL
    setFormUrl(url);
    setLoading(false);
  }, [location]);

  // Copy form URL to clipboard
  const copyToClipboard = () => {
    if (formUrl) {
      navigator.clipboard.writeText(formUrl).then(
        () => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        },
        (err) => {
          console.error("Could not copy URL: ", err);
        }
      );
    }
  };

  if (loading) {
    return <Loader />
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50 p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <FaExclamationCircle className="text-red-500 text-5xl mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Form Unavailable</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.history.back()}
            className="px-6 py-2 bg-navy-blue text-white rounded-md hover:bg-dark-purple transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-5xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Header section */}
          <div className="bg-navy-blue text-white p-6">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold">Event Registration</h1>
              <div className="flex items-center">
                <button
                  onClick={copyToClipboard}
                  className="flex items-center gap-2 px-3 py-1 bg-white bg-opacity-20 rounded text-sm hover:bg-opacity-30 transition-colors"
                  title="Copy form URL"
                >
                  {copied ? <FaCheck size={14} /> : <FaClipboard size={14} />}
                  {copied ? "Copied!" : "Copy URL"}
                </button>
              </div>
            </div>
            <p className="mt-2 text-white text-opacity-90">
              Please complete the form below to register for this event
            </p>
          </div>
          
          {/* Form container */}
          <div className="p-1 bg-gray-100">
            <div className="bg-white h-screen md:h-[800px]">
              <iframe
                src={formUrl}
                title="Registration Form"
                className="w-full h-full border-0"
                frameBorder="0"
                marginHeight="0"
                marginWidth="0"
              >
                Loading form...
              </iframe>
            </div>
          </div>
          
          {/* Footer */}
          <div className="bg-gray-50 p-4 text-center text-sm text-gray-500 border-t">
            <p>
              If you're having trouble viewing this form, you can{" "}
              <a 
                href={formUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-navy-blue hover:underline"
              >
                open it in a new tab
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationForm;