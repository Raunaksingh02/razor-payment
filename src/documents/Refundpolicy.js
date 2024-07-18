import React from 'react';
import backarrowlogo from '../images/backarrowlogo.png';
import { Link } from 'react-router-dom';

function Refundpolicy() {
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
    
      <p>Thank you for choosing CafeHouse. We strive to provide the best quality food and service to our customers in DA11 Defence Colony, Ghaziabad. Please read our refund policy carefully.</p>
      
      <h2 className="text-2xl font-bold mt-6 mb-3">No Refund Policy</h2>
      <p>At CafeHouse, we maintain a strict no-refund policy due to the perishable nature of our products. Once an order has been placed and payment has been processed, we cannot offer any refunds or exchanges.</p>
      
      <h2 className="text-2xl font-bold mt-6 mb-3">Order Accuracy</h2>
      <p>We encourage our customers to review their orders carefully before finalizing the purchase. If you notice any errors or have any special requests, please contact us immediately after placing your order to make the necessary adjustments.</p>
      
      <h2 className="text-2xl font-bold mt-6 mb-3">Exceptional Circumstances</h2>
      <p>While our general policy is not to provide refunds, we understand that exceptional circumstances may arise. In such cases, please reach out to our customer service team. We will review your request and, at our sole discretion, determine if a refund or credit is warranted.</p>
      
      <h2 className="text-2xl font-bold mt-6 mb-3">Contact Us</h2>
      <p>If you have any questions or concerns about our refund policy, please contact us:</p>
      <p><strong>CafeHouse</strong></p>
      <p>DA11 Defence Colony, Ghaziabad</p>
      <p>Email: <a href="rs3287275@gmail.com" className="text-blue-600 hover:underline">support@cafehouse.com</a></p>
      <p>Phone: <a href="tel:+919971299049" className="text-blue-600 hover:underline">+91 98765 43210</a></p>
      
      <p className="mt-6">We appreciate your understanding and cooperation. Thank you for choosing CafeHouse!</p>
    </div>
  );
}

export default Refundpolicy;





























