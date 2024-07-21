import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-[#f6931e] rounded-3xl p-3 mt-3 mb-3 text-gray-800 ">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap -mx-4">
          <div className="w-full md:w-1/3 px-4">
            <h5 className="text-xl text-white font-extrabold mb-2">About Us</h5>
            <p className="mb-4 font-bold">
              We are a company dedicated to providing the best products and services to our customers. Your satisfaction is our priority.
            </p>
          </div>
          <div className="w-full md:w-1/3 px-4">
            <h5 className="text-xl text-white font-extrabold  mb-2">Important Links</h5>
            <ul className="list-none">
            <Link to="/docs/Shippingdetail" className="mb-2">
                <p className="text-gray-800 font-bold hover:text-gray-600">Shipping Details</p>
              </Link>
              <Link to="/docs/Refund" className="mb-2">
                <p className="text-gray-800 font-bold hover:text-gray-600">Refund Policy</p>
              </Link> 
              <Link to="/docs/Cancel" className="mb-2">
                <p className="text-gray-800 font-bold hover:text-gray-600">Cancellation</p>
              </Link> 
              <Link to="/docs/terms" className="mb-2">
                <p className="text-gray-800 font-bold hover:text-gray-600">Terms and Condition</p>
              </Link>
              <Link to="/docs/Privacy" className="mb-2">
                <p className="text-gray-800 font-bold hover:text-gray-600">Privacy Policy</p>
              </Link>
              <Link to="/docs/About" className="mb-2">
                <p className="text-gray-800 font-bold hover:text-gray-600">About Us</p>
              </Link>
              <Link to="/docs/Contact" className="mb-2">
                <p className="text-gray-800 font-bold hover:text-gray-600">Contact us</p>
              </Link>
            </ul>
          </div>
          <div className="w-full md:w-1/3 px-4">
            <h5 className="text-xl font-bold text-white mb-2">Contact Us</h5>
            <p className="mb-2 font-bold">Address: DA-11 Defence Colony, Bhopura, Ghaziabad</p>
            <p className='font-extrabold' >Email: <a href="rs3287275@gmail.com" className="text-gray-800 font-bold hover:text-gray-600">info@company.com</a></p>
            <p className='font-extrabold'>Phone: <a href="91-9971299049" className="text-gray-800 font-bold hover:text-gray-600">+123 456 7890</a></p>
          </div>
        </div>
      </div>
      <div className="text-center text-white mt-4">
      <p>&copy; Da 11 defence colony,Ghaziabad ,UP 201005  </p>
        <p>&copy; 2024 Cafe House. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
