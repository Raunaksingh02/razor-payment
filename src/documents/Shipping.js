import React from 'react';
import backarrowlogo from '../images/backarrowlogo.png';
import { Link } from 'react-router-dom';


function Shipping() {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
       <div className='flex items-center mb-4'>
        <div className='mr-4'>
          <Link to="/">
            <img src={backarrowlogo} className='h-10 w-10' alt="Back" />
          </Link>
        </div>
        <div className='flex-1 text-center'>
          <h1 className='font-bold text-2xl'>Shipping and Delivery</h1>
        </div>
      </div>
      <p>Welcome to CafeHouse! We are committed to delivering your orders in a timely and efficient manner. Please review our shipping policy for detailed information on our delivery process.</p>
      
      <h2 className="text-2xl font-bold mt-6 mb-3">Delivery Areas</h2>
      <p>We currently offer delivery services within DA11 Defence Colony, Ghaziabad, and surrounding areas. If you are outside our delivery zone, please contact us to discuss potential arrangements.</p>
      
      <h2 className="text-2xl font-bold mt-6 mb-3">Delivery Time</h2>
      <ul className="list-disc list-inside">
        <li>Our standard delivery time is within 30-45 minutes from the time of order confirmation.</li>
        <li>During peak hours or due to unforeseen circumstances, delivery times may be extended. We appreciate your understanding and patience.</li>
      </ul>
      
      <h2 className="text-2xl font-bold mt-6 mb-3">Delivery Charges</h2>
      <p>Delivery charges are calculated based on your location and will be displayed at checkout. We strive to keep our delivery fees reasonable while ensuring prompt and efficient service.</p>
      
      <h2 className="text-2xl font-bold mt-6 mb-3">Order Tracking</h2>
      <p>You can track the status of your order through our website. Once your order is out for delivery, you will receive an update with the estimated time of arrival.</p>
      
      <h2 className="text-2xl font-bold mt-6 mb-3">Contactless Delivery</h2>
      <p>For your safety and convenience, we offer contactless delivery. Please specify your preference at the time of order, and our delivery personnel will leave your order at your doorstep.</p>
      
      <h2 className="text-2xl font-bold mt-6 mb-3">Delivery Issues</h2>
      <p>If you encounter any issues with your delivery, such as missing items or delays, please contact our customer service team immediately. We are here to assist you and ensure your satisfaction.</p>
      
      <h2 className="text-2xl font-bold mt-6 mb-3">Contact Us</h2>
      <p>If you have any questions or concerns about our shipping policy, please do not hesitate to reach out to us:</p>
      <p><strong>CafeHouse</strong></p>
      <p>DA11 Defence Colony, Ghaziabad</p>
      <p>Email: <a href="rs3287275@gmail.com"  className="text-blue-600 hover:underline">support@cafehouse.com</a></p>
      <p>Phone: <a href="tel:+919971299049" className="text-blue-600 hover:underline">+91 98765 43210</a></p>
    </div>
  );
}

export default Shipping;
