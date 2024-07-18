import React from 'react';
import backarrowlogo from '../images/backarrowlogo.png';
import { Link } from 'react-router-dom';
export default function Termcondition() {
  return (
   
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
    <div className='flex items-center mb-4'>
        <div className='mr-4'>
          <Link to="/">
            <img src={backarrowlogo} className='h-10 w-10' alt="Back" />
          </Link>
        </div>
        <div className='flex-1 text-center'>
          <h1 className='font-bold text-2xl'>Terms and Conditions</h1>
        </div>
      </div>
    
      <p>Welcome to CafeHouse! These terms and conditions outline the rules and regulations for the use of CafeHouse's website and services, located at DA11 Defence Colony, Ghaziabad.</p>
      
      <h2 className="text-2xl font-bold mt-6 mb-3">1. Acceptance of Terms</h2>
      <p>By accessing this website, we assume you accept these terms and conditions in full. Do not continue to use CafeHouse's website if you do not accept all of the terms and conditions stated on this page.</p>
      
      <h2 className="text-2xl font-bold mt-6 mb-3">2. Service Description</h2>
      <p>CafeHouse provides an online platform for ordering food and beverages. Our services are available to customers in DA11 Defence Colony, Ghaziabad, and surrounding areas.</p>
      
      <h2 className="text-2xl font-bold mt-6 mb-3">3. Orders and Payments</h2>
      <ul className="list-disc list-inside">
        <li>All orders placed through our website are subject to acceptance and availability.</li>
        <li>Prices for our products are subject to change without notice.</li>
        <li>Payments must be made at the time of order through our secure payment gateway.</li>
      </ul>
      
      <h2 className="text-2xl font-bold mt-6 mb-3">4. Delivery</h2>
      <ul className="list-disc list-inside">
        <li>Delivery times are estimates and may vary due to factors beyond our control.</li>
        <li>CafeHouse will not be held responsible for any delays in delivery.</li>
      </ul>
      
      <h2 className="text-2xl font-bold mt-6 mb-3">5. Cancellation and Refunds</h2>
      <ul className="list-disc list-inside">
        <li>Orders can be canceled within 5 minutes of placing them.</li>
        <li>Refunds will be processed in accordance with our refund policy, available on our website.</li>
      </ul>
      
      <h2 className="text-2xl font-bold mt-6 mb-3">6. User Responsibilities</h2>
      <ul className="list-disc list-inside">
        <li>Users must provide accurate and up-to-date information when placing orders.</li>
        <li>Users are responsible for maintaining the confidentiality of their account details.</li>
      </ul>
      
      <h2 className="text-2xl font-bold mt-6 mb-3">7. Limitation of Liability</h2>
      <p>CafeHouse shall not be liable for any direct, indirect, incidental, special, or consequential damages resulting from the use or inability to use our services.</p>
      
      <h2 className="text-2xl font-bold mt-6 mb-3">8. Changes to Terms</h2>
      <p>We reserve the right to amend these terms and conditions at any time. Any changes will be posted on this page and will take effect immediately.</p>
      
      <h2 className="text-2xl font-bold mt-6 mb-3">9. Contact Us</h2>
      <p>If you have any questions about these terms and conditions, please contact us at:</p>
      <p><strong>CafeHouse</strong></p>
      <p>DA11 Defence Colony, Ghaziabad</p>
      <p>Email: <a href="rs3287275@gmail.com" className="text-blue-600 hover:underline">support@cafehouse.com</a></p>
      <p>Phone: <a href="tel:+919971299049" className="text-blue-600 hover:underline">+91 98765 43210</a></p>
    </div>
  );
}







