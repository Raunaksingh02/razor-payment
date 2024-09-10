import React, { useContext } from 'react';
import { CouponContext } from './CouponContext';

const Couponmodal = () => {
  const { coupons, isModalOpen, toggleModal, deleteCoupon } = useContext(CouponContext);
  console.log("the coupon is  ",coupons);

  return (
    <>
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl shadow-2xl w-11/12 md:w-2/3 lg:w-1/2 p-8 relative">
            <button
              onClick={toggleModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold"
            >
              &times;
            </button>
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Available Coupons</h2>

            {/* Display Coupon Details */}
            {coupons.length > 0 ? (
              <div className="space-y-4">
                {coupons.map((coupon) => (
                  <div
                    key={coupon._id}
                    className="border border-gray-200 rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow"
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="text-lg font-semibold text-gray-700">{coupon.name}</h3>
                      <button
                        onClick={() => deleteCoupon(coupon._id)}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        Delete
                      </button>
                    </div>
                    <p className="text-gray-600">
                      <strong>Discount:</strong> {coupon.discountPercentage}% off
                    </p>
                    {coupon.description && (
                      <p className="text-gray-600">
                        <strong>Description:</strong> {coupon.description}
                      </p>
                    )}
                    {coupon.expiryDate && (
                      <p className="text-gray-600">
                        <strong>Expiry Date:</strong> {new Date(coupon.expiryDate).toLocaleDateString()}
                      </p>
                    )}
                    {coupon.maxDiscountAmount && (
                      <p className="text-gray-600">
                        <strong>Max Discount:</strong> ₹{coupon.maxDiscountAmount}
                      </p>
                    )}
                    {coupon.minOrderValue && (
                      <p className="text-gray-600">
                        <strong>Min Order Value:</strong> ₹{coupon.minOrderValue}
                      </p>
                    )}
                    <p className={`text-sm mt-2 font-semibold ${coupon.isActive ? 'text-green-500' : 'text-red-500'}`}>
                      {coupon.isActive ? 'Active' : 'Inactive'}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500">No coupons available at the moment.</p>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Couponmodal;
