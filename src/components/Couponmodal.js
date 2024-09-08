import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal'; // Make sure to install this package or use a different modal library if preferred
import { FaTimes } from 'react-icons/fa';

Modal.setAppElement('#root'); // For accessibility

const Couponmodal = ({ isOpen, onRequestClose }) => {
  const [coupons, setCoupons] = useState([]);

  useEffect(() => {
    if (isOpen) {
      const fetchCoupons = async () => {
        try {
          const { data } = await axios.get('http://localhost:1000/coupons');
          setCoupons(data.coupons);
        } catch (error) {
          console.error('Error fetching coupons:', error);
        }
      };
      fetchCoupons();
    }
  }, [isOpen]);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Coupons Modal"
      className="modal max-w-lg mx-auto p-6 bg-white rounded-lg shadow-lg relative"
      overlayClassName="overlay fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center"
    >
      <button
        onClick={onRequestClose}
        className="absolute top-2 right-2 text-2xl text-gray-500 hover:text-gray-800"
      >
        <FaTimes />
      </button>
      <h2 className="text-2xl font-bold mb-4 text-center">Available Coupons</h2>
      <ul className="space-y-4">
        {coupons.length > 0 ? (
          coupons.map((coupon) => (
            <li key={coupon._id} className="p-4 border border-gray-300 rounded-lg">
              <p className="font-semibold text-lg">{coupon.name}</p>
              <p className="text-sm text-gray-600">{coupon.discountPercentage}% off</p>
              <p className="mt-2 text-gray-800">{coupon.description}</p>
            </li>
          ))
        ) : (
          <p className="text-center">No coupons available at the moment.</p>
        )}
      </ul>
    </Modal>
  );
};

export default Couponmodal;
