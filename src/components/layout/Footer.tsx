
import { Link } from "react-router-dom";

export function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                DB
              </div>
              <span className="text-lg font-semibold text-gray-800">
                DocBook
              </span>
            </Link>
            <p className="text-sm text-gray-600 mt-2">
              Simplifying the way you book doctor appointments
            </p>
          </div>
          
          <div>
            <p className="text-sm text-gray-500">
              &copy; {currentYear} DocBook. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
