import React from 'react';
import backarrowlogo from '../images/backarrowlogo.png';
import { Link } from 'react-router-dom';

function Cancellation() {
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
      <p>At CafeHouse, we understand that sometimes plans change and you may need to cancel your order. Please read our cancellation policy carefully to understand our guidelines and procedures.</p>
      
      <h2 className="text-2xl font-bold mt-6 mb-3">Order Cancellation</h2>
      <ul className="list-disc list-inside">
        <li>Orders can be canceled within 5 minutes of placing them. Please contact our customer service team immediately if you need to cancel your order.</li>
        <li>After 5 minutes, orders cannot be canceled as they are already being prepared for delivery.</li>
      </ul>
      
      <h2 className="text-2xl font-bold mt-6 mb-3">How to Cancel an Order</h2>
      <p>To cancel an order, please contact our customer service team as soon as possible. You can reach us via:</p>
      <p><strong>Email:</strong> <a href="mailto:support@cafehouse.com" className="text-blue-600 hover:underline">rs3287275@gmail.com</a></p>
      <p><strong>Phone:</strong> <a href="tel:+919876543210" className="text-blue-600 hover:underline">+91 9971299049</a></p>
      
      <h2 className="text-2xl font-bold mt-6 mb-3">Non-Cancelable Items</h2>
      <p>Some items may not be eligible for cancellation due to their nature, such as special orders or items that have been customized to your specifications. Our customer service team will inform you if your order falls into this category.</p>
      
      <h2 className="text-2xl font-bold mt-6 mb-3">Refunds for Canceled Orders</h2>
      <p>If your order is canceled within the allowable time frame, a full refund will be processed. Please allow 5-7 business days for the refund to reflect in your account.</p>
      
      <h2 className="text-2xl font-bold mt-6 mb-3">Contact Us</h2>
      <p>If you have any questions or concerns about our cancellation policy, please feel free to reach out to us:</p>
      <p><strong>CafeHouse</strong></p>
      <p>DA11 Defence Colony, Ghaziabad</p>
      <p>Email: <a href="rs3287275@gmail.com.com" className="text-blue-600 hover:underline">rs3287275@gmail.com</a></p>
      <p>Phone: <a href="tel:+919971299049" className="text-blue-600 hover:underline">+91 9971299049</a></p>
    </div>
  );
}

export default Cancellation;
