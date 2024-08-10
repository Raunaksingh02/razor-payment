import React from 'react';
import backarrowlogo from '../images/backarrowlogo.png';
import { Link } from 'react-router-dom';

function AboutUs() {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
       <div className='flex items-center mb-4'>
        <div className='mr-4'>
          <Link to="/">
            <img src={backarrowlogo} className='h-10 w-10' alt="Back" />
          </Link>
        </div>
        <div className='flex-1 text-center'>
          <h1 className='font-bold text-2xl'>About us</h1>
        </div>
      </div>
    
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-3">Our Story</h2>
        <p>CafeHouse was founded with the vision of creating a welcoming space where people can enjoy delicious food and beverages in DA11 Defence Colony, Ghaziabad. Our journey began in 2023, when our passion for food and community inspired us to open our doors and share our culinary creations with our neighbors.</p>
      </div>
      
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-3">Our Mission</h2>
        <p>At CafeHouse, our mission is to provide high-quality, freshly prepared meals that cater to diverse tastes and preferences. We believe in using the finest ingredients to create dishes that are not only delicious but also nourishing. Our goal is to create a memorable dining experience for every customer, every time.</p>
      </div>
      
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-3">What We Offer</h2>
        <ul className="list-disc list-inside">
          <li>A wide variety of meals, including vegetarian, vegan, and gluten-free options.</li>
          <li>Freshly brewed coffee and a selection of teas.</li>
          <li>A cozy and inviting atmosphere perfect for dining, working, or relaxing.</li>
          <li>Convenient online ordering for delivery and takeaway.</li>
        </ul>
      </div>
      
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-3">Our Team</h2>
        <p>Our dedicated team is the heart of CafeHouse. From our talented chefs who craft each meal with care, to our friendly staff who ensure that every visit is enjoyable, we are committed to excellence. We believe in fostering a positive and inclusive workplace where every team member is valued and empowered to contribute their best.</p>
      </div>
      
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-3">Contact Us</h2>
        <p>We love hearing from our customers! Whether you have feedback, questions, or just want to say hello, feel free to reach out to us:</p>
        <p><strong>CafeHouse</strong></p>
        <p>DA11 Defence Colony, Ghaziabad</p>
        <p>Email: <a href="mailto:support@cafehouse.com" className="text-blue-600 hover:underline">rs3287274@gmail.com</a></p>
        <p>Phone: <a href="tel:+919876543210" className="text-blue-600 hover:underline">+91 9971299049</a></p>
      </div>

      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-3">Follow Us</h2>
        <p>Stay connected with us through our social media channels:</p>
        <ul className="list-disc list-inside">
         
        </ul>
      </div>

      <div className="mb-6">
       
       </div>
    </div>
  );
}

export default AboutUs;
