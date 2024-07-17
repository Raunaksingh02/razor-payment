import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-[#f6931e] rounded-3xl p-3 mt-3 mb-3 text-gray-800 ">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap -mx-4">
          <div className="w-full md:w-1/3 px-4">
            <h5 className="text-xl text-white font-extrabold mb-2">About Us</h5>
            <p className="mb-4 font-extrabold">
              We are a company dedicated to providing the best products and services to our customers. Your satisfaction is our priority.
            </p>
          </div>
          <div className="w-full md:w-1/3 px-4">
            <h5 className="text-xl text-white font-extrabold  mb-2">Important Links</h5>
            <ul className="list-none">
              <li className="mb-2">
                <a href="/refund-policy" className="text-gray-800 font-extrabold hover:text-gray-600">Refund Policy</a>
              </li>
              <li className="mb-2">
                <a href="/terms-and-conditions" className="text-gray-800 font-extrabold hover:text-gray-600">Terms and Conditions</a>
              </li>
              <li className="mb-2">
                <a href="/about-us" className="text-gray-800 font-extrabold hover:text-gray-600">About Us</a>
              </li>
            </ul>
          </div>
          <div className="w-full md:w-1/3 px-4">
            <h5 className="text-xl font-bold text-white mb-2">Contact Us</h5>
            <p className="mb-2 font-extrabold">Address: DA-11 Defence Colony, Bhopura, Ghaziabad</p>
            <p className='font-extrabold' >Email: <a href="mailto:info@company.com" className="text-gray-800 font-extrabold hover:text-gray-600">info@company.com</a></p>
            <p className='font-extrabold'>Phone: <a href="tel:+1234567890" className="text-gray-800 font-extrabold hover:text-gray-600">+123 456 7890</a></p>
          </div>
        </div>
      </div>
      <div className="text-center text-white mt-4">
        <p>&copy; 2024 Your Company. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
