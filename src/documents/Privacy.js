import React from 'react';
import backarrowlogo from '../images/backarrowlogo.png';
import { Link } from 'react-router-dom';


const PrivacyPolicy = () => {
  return (
    <div className="max-w-7xl mx-auto p-6 sm:p-12">
          <div className='flex items-center mb-4'>
        <div className='mr-4'>
          <Link to="/">
            <img src={backarrowlogo} className='h-10 w-10' alt="Back" />
          </Link>
        </div>
        <div className='flex-1 text-center'>
          <h1 className='font-bold text-2xl'>Privacy Policy</h1>
        </div>
      </div>
      <p className="mb-4">
        At CafeHouse, we value your privacy and are committed to protecting your personal information. This Privacy Policy outlines how we collect, use, and safeguard your data when you use our services.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-4">Information We Collect</h2>
      <p className="mb-4">
        When you visit our website or place an order, we may collect the following information:
      </p>
      <ul className="list-disc list-inside mb-4">
        <li>Personal identification information (Name, email address, phone number, etc.)</li>
        <li>Order details (products ordered, delivery address, payment information, etc.)</li>
        <li>Usage data (browsing history, search queries, etc.)</li>
        <li>Technical data (IP address, browser type, operating system, etc.)</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-6 mb-4">How We Use Your Information</h2>
      <p className="mb-4">
        We use the collected data for the following purposes:
      </p>
      <ul className="list-disc list-inside mb-4">
        <li>To process and fulfill your orders</li>
        <li>To provide customer support</li>
        <li>To improve our services and website</li>
        <li>To communicate with you about your orders, offers, and updates</li>
        <li>To analyze website usage and optimize user experience</li>
      </ul>

      <h2 className="text-2xl font-semibold mt-6 mb-4">Data Protection and Security</h2>
      <p className="mb-4">
        We implement a variety of security measures to maintain the safety of your personal information. Your data is stored on secure servers and is protected against unauthorized access, alteration, disclosure, or destruction.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-4">Cookies</h2>
      <p className="mb-4">
        Our website uses cookies to enhance your browsing experience. Cookies are small files that are stored on your device. You can choose to disable cookies through your browser settings, but this may affect the functionality of our website.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-4">Third-Party Services</h2>
      <p className="mb-4">
        We may use third-party services to assist in various aspects of our operations, such as payment processing and analytics. These third parties have access to your information only to perform specific tasks on our behalf and are obligated to protect your data.
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-4">Your Rights</h2>
      <p className="mb-4">
        You have the right to access, correct, or delete your personal information. If you wish to exercise these rights or have any questions about our privacy practices, please contact us at [contact email].
      </p>

      <h2 className="text-2xl font-semibold mt-6 mb-4">Changes to This Privacy Policy</h2>
      <p className="mb-4">
        We may update our Privacy Policy from time to time. Any changes will be posted on this page, and we encourage you to review this policy periodically.
      </p>

      <p className="mb-4">
        By using our services, you consent to the terms of this Privacy Policy.
      </p>

      <p className="mt-6">
        If you have any questions or concerns about our Privacy Policy, please contact us at:
      </p>
      <p className="mt-4">
        CafeHouse<br />
        DA11 Defence Colony, Ghaziabad<br />
        Email: rs3287275@gmail.com<br />
        Phone: 9971299049
      </p>
    </div>
  );
};

export default PrivacyPolicy;


