import React, { useState, useEffect } from 'react';
import axios from 'axios';
import backarrowlogo from "../images/backarrowlogo.png"
import { Link} from 'react-router-dom';

const CouponManager = () => {
  const [coupons, setCoupons] = useState([]);
  const [newCoupon, setNewCoupon] = useState({
    name: '',
    discountPercentage: '',
    description: '',
    maxDiscountAmount: '',
    minOrderValue: '',
  });

  // Fetch Coupons
  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const { data } = await axios.get('http://localhost:1000/coupons');
        setCoupons(data.coupons); // Ensure you're accessing the correct field from the response
        
      } catch (error) {
        console.error('Error fetching coupons:', error);
      }
    };
    fetchCoupons();
  }, []);

  // Handle Input Change
  const handleInputChange = (e) => {
    setNewCoupon({ ...newCoupon, [e.target.name]: e.target.value });
  };

  // Add Coupon
  const handleAddCoupon = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:1000/add', newCoupon); // Correct POST endpoint
      setNewCoupon({ name: '', discountPercentage: '', description: '', maxDiscountAmount: '', minOrderValue: '' });
      alert('Coupon added successfully!');
      // Refresh the coupon list after adding a new coupon
      const { data } = await axios.get('http://localhost:1000/coupons');
      setCoupons(data.coupons);
    } catch (error) {
      console.error('Error adding coupon:', error);
    }
  };

  // Delete Coupon
  const handleDeleteCoupon = async (couponName) => {
    try {
      await axios.delete(`http://localhost:1000/delete/${couponName}`); // Correct DELETE endpoint
      setCoupons(coupons.filter((coupon) => coupon.name !== couponName));
      alert('Coupon deleted successfully!');
    } catch (error) {
      console.error('Error deleting coupon:', error);
    }
  };

  return (
    <div className="p-4">
      <div className='flex items-center mb-4'>
       
        <div className='mr-4'>
          <Link to="/owner">
            <img src={backarrowlogo} className='h-10 w-10' alt="Back" />
          </Link>
        </div>
        <div className='flex-1 text-center'>
          <h1 className='font-bold text-2xl'>Add Coupon</h1>
        </div>
      </div>
      {/* Add Coupon Form */}
      <form onSubmit={handleAddCoupon} className="space-y-4 mb-6">
        <div>
          <input
            type="text"
            name="name"
            value={newCoupon.name}
            onChange={handleInputChange}
            placeholder="Coupon Name"
            className="border p-2 w-full"
            required
          />
        </div>
        <div>
          <input
            type="number"
            name="discountPercentage"
            value={newCoupon.discountPercentage}
            onChange={handleInputChange}
            placeholder="Discount Percentage"
            className="border p-2 w-full"
            required
          />
        </div>
        <div>
          <input
            type="number"
            name="minOrderValue"
            value={newCoupon.minOrderValue}
            onChange={handleInputChange}
            placeholder="minOrderValue"
            className="border p-2 w-full"
            required
          />
        </div>
        <div>
          <textarea
            name="description"
            value={newCoupon.description}
            onChange={handleInputChange}
            placeholder="Description"
            className="border p-2 w-full"
          />
        </div>
       
       <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">Add Coupon</button>
      </form>

      {/* Coupons List */}
      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-4">Existing Coupons</h3>
        <ul className="space-y-4">
          {coupons.map((coupon) => (
            <li key={coupon._id} className="flex justify-between items-center p-2 border">
              <div>
                <p><strong>{coupon.name}</strong> - {coupon.discountPercentage}% off</p>
                <p>{coupon.description}</p>
              </div>
              <button
                onClick={() => handleDeleteCoupon(coupon.name)}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CouponManager;
