import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, FileQuestion } from "lucide-react";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      {/* Main Content Container */}
      <div className="text-center max-w-md mx-auto">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-orange-100 rounded-full">
            <FileQuestion className="h-16 w-16 text-orange-600" />
          </div>
        </div>

        {/* 404 Heading */}
        <h1 className="text-9xl font-extrabold text-gray-200">404</h1>

        {/* Error Message */}
        <h2 className="text-3xl font-bold text-gray-900 mt-4 mb-2">
          Page Not Found
        </h2>
        <p className="text-lg text-gray-600 mb-8">
          Oops! The page you are looking for doesn't exist. It might have been
          moved, deleted, or you typed the URL incorrectly.
        </p>

        {/* Call to Action Button */}
        <Link to="/dashboard">
          <Button className="bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition-colors duration-200 flex items-center">
            <Home className="h-5 w-5 mr-2" />
            Go Back Home
          </Button>
        </Link>
      </div>

      {/* Optional: Footer */}
      <p className="text-sm text-gray-500 mt-12">
        &copy; {new Date().getFullYear()} WattBot. All rights reserved.
      </p>
    </div>
  );
};

export default NotFound;
