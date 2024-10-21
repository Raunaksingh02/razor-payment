import React, { useState, useEffect, useContext } from 'react';
import { MdDelete } from 'react-icons/md';
import axios from 'axios';
import { BuyerContext } from './components/Buyercontext.js';

const Pos = () => {
  const { walletamount, customerDetails } = useContext(BuyerContext);
  const [items, setItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [quantity, setQuantity] = useState(0); // For total quantity in cart
  const [discount, setDiscount] = useState(0);
  const [paymentMode, setPaymentMode] = useState('');
  const [cash, setCash] = useState(0);
  const [category, setCategory] = useState('All'); // For category selection
  const [showBill, setShowBill] = useState(false); // Toggle Bill section
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  console.log(cart);
  const [walletamt,setwalletamt] = useState(0);
  const [walletuse,setwalletuse] = useState(false);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await axios.get('https://backendaggrawal-8dey.onrender.com/getdish');
        setItems(response.data);

      } catch (error) {
        console.error('Error fetching items:', error);
      }
    };
    fetchItems(); 
  }, []);

  useEffect(() => {
    const fetchwallet = async () => {
      try {
        const response = await axios.get(`https://backendcafe-zqt8.onrender.com/api/customer/${customerPhone}`);
        setwalletamt(response.data.wallet);
        console.log(response.data);
      } catch (error) {
        console.error('Error fetching items:', error);
      }
    };
    fetchwallet(); 
  }, [customerPhone]);

  useEffect(() => {
    calculateTotal();
  }, [cart, discount]);

  const calculateTotal = () => {
    let totalAmount = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    totalAmount -= discount;
    if(walletuse  === true){
      totalAmount-= walletamt;
    }
    setTotal(totalAmount);
    let totalQuantity = cart.reduce((acc, item) => acc + item.quantity, 0);
    setQuantity(totalQuantity); 
  };

  const addToCart = (item, size = '', price = '') => {
    // Default to the first available size if none selected
    if (!size) {
      size = item.sizes[0].size; // Default to the first size
      price = item.sizes[0].price; // Default to the first price
    }

    const existingItem = cart.find(cartItem => cartItem.id === item._id && cartItem.size === size);
    if (existingItem) {
      const updatedCart = cart.map(cartItem => {
        if (cartItem.id === item._id && cartItem.size === size) {
          return { ...cartItem, quantity: cartItem.quantity + 1 };
        }
        return cartItem;
      });
      setCart(updatedCart);
    } else {
      setCart([...cart, { ...item, id: item._id, size, price, quantity: 1 }]); // Ensure correct `id` and size
    }
  };

  const removeFromCart = (id, size) => {
    const updatedCart = cart.filter(item => !(item.id === id && item.size === size));
    setCart(updatedCart);
  };

  const incrementQuantity = (id, size) => {
    const updatedCart = cart.map(item => {
      if (item.id === id && item.size === size) {
        return { ...item, quantity: item.quantity + 1 };
      }
      return item;
    });
    setCart(updatedCart);
  };

  const decrementQuantity = (id, size) => {
    const updatedCart = cart.map(item => {
      if (item.id === id && item.size === size && item.quantity > 1) {
        return { ...item, quantity: item.quantity - 1 };
      }
      return item;
    });
    setCart(updatedCart);
  };

  const handlePayment = async () => {
    try {
      const paymentData = {
        cart,
        total,
        discount,
        paymentMode,
        cash,
        walletUsed: paymentMode === 'Wallet' ? walletamount : 0,
        customerName,
        customerPhone
      };
      const response = await axios.post('/api/pay', paymentData);
      alert('Payment successful!');
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed. Please try again.');
    }
  };

  const handleCategoryChange = (selectedCategory) => {
    setCategory(selectedCategory);
  };

  return (
    <div className="h-screen flex flex-col justify-between">
      <h2 className="text-2xl font-bold mb-4">POS System</h2>

      {/* Category Tabs */}
      <div className="flex mb-4">
        {['All', ...new Set(items.map(item => item.category))].map((cat, index) => (
          <button
            key={index}
            className={`shrink-0 px-4 py-2 text-sm m-1 font-bold rounded-md transition duration-300 whitespace-nowrap ${category === cat ? 'bg-[#f6931e] text-white' : 'bg-gray-200 text-gray-600'}`}
            onClick={() => handleCategoryChange(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Items Grid */}
      <div className="flex">
        <div className="grid grid-cols-2 mb-4">
          {items.filter(item => category === 'All' || item.category === category).map((item) => (
            <div key={item._id} className="border p-2 rounded-lg">
              <img src={item.image} alt={item.name} className="h-20 w-20" />
              <h4 className="text-lg font-bold">{item.name}</h4>

              <div className="mt-2">
                {/* Size selection with dropdown */}
                <select
                  id={`size-select-${item._id}`}
                  className="w-30 p-2 border rounded-md text-gray-600"
                  onChange={(e) => {
                    const selectedSize = item.sizes.find(sizeOption => sizeOption.size === e.target.value);
                    if (selectedSize) {
                      addToCart(item, selectedSize.size, selectedSize.price);
                    }
                  }}
                >
                  <option value="">Choose size</option>
                  {item.sizes.map((sizeOption) => (
                    <option key={sizeOption.size} value={sizeOption.size}>
                      {sizeOption.size} - ₹{sizeOption.price}
                    </option>
                  ))}
                </select>
              </div>

              {/* Increment/Decrement Buttons */}
              <div className="flex items-center mt-2">
                <button
                  onClick={() => decrementQuantity(item._id, item.sizes[0].size)}
                  className="px-2 py-1 bg-red-500 text-white rounded-lg"
                >
                  -
                </button>
                <span className="mx-2">{cart.find(cartItem => cartItem.id === item._id && cartItem.size === item.sizes[0].size)?.quantity || 0}</span>
                <button
                  onClick={() => incrementQuantity(item._id, item.sizes[0].size)}
                  className="px-2 py-1 bg-green-500 text-white rounded-lg"
                >
                  +
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Fixed Footer */}
      <div className="fixed bottom-0 left-0 w-full bg-white p-4 shadow-lg">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-gray-600">Total Items: {quantity}</p>
            <p className="text-lg font-bold">Total: ₹{total}</p>
          </div>
          <button
            className="bg-[#f6931e] text-white px-6 py-2 rounded-lg"
            onClick={() => setShowBill(!showBill)}
          >
            {showBill ? 'Hide Bill' : 'Show Bill'}
          </button>
        </div>
      </div>

      {/* Bill Section */}
      {showBill && (
        <div className="fixed top-0 left-0 w-full h-screen bg-white p-4 overflow-y-auto z-50">
          <div className="flex justify-between">
            <h3 className="text-xl font-bold mb-4">Bill Summary</h3>
            <button
              className="text-gray-500"
              onClick={() => setShowBill(false)}
            >
              Close
            </button>
          </div>
          {cart.length === 0 ? (
            <p className="text-gray-500">No items in cart</p>
          ) : (
            <div>
              {cart.map((item) => (
                <div key={`${item._id}-${item.size}`} className="flex justify-between items-center border-b py-2">
                  <div>
                    <h4 className="font-bold">{item.name} ({item.size})</h4>
                    <p>₹{item.price} x {item.quantity}</p>
                  </div>

                  <div className='flex' >
                    <button
                      onClick={() => decrementQuantity(item._id, item.size)}
                      className="px-2 py-1 bg-red-500 text-white rounded-lg"
                    >
                      -
                    </button>
                    <span className="mx-2">{item.quantity}</span>
                    <button
                      onClick={() => incrementQuantity(item._id, item.size)}
                      className="px-2 py-1 bg-green-500 text-white rounded-lg"
                    >
                      +
                    </button>
                    <MdDelete
                      className="text-red-500 h-8 w-8 ml-2 mt-1 cursor-pointer"
                      onClick={() => removeFromCart(item._id, item.size)}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Payment Details */}
          <div className="mt-4">
            <label className="font-bold">Payment Mode:</label>
            <select
              value={paymentMode}
              onChange={(e) => setPaymentMode(e.target.value)}
              className="w-full border p-2 rounded-md mt-2"
            >
              <option value="">Select</option>
              <option value="Cash">Cash</option>
              <option value="Wallet">Wallet (₹{walletamount})</option>
              {/* Add other payment options */}
            </select>
            <label className="mt-4 font-bold">Discount:</label>
            <input
              type="number"
              value={discount}
              onChange={(e) => setDiscount(parseInt(e.target.value) || 0)}
              className="w-full border p-2 rounded-md mt-2"
              placeholder="Enter discount amount"
            />
            <label className="mt-4 font-bold">Customer Details:</label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full border p-2 rounded-md mt-2"
              placeholder="Enter customer name"
            />
            <input
              type="text"
              value={customerPhone}
              onChange={(e) => setCustomerPhone(e.target.value)}
              className="w-full border p-2 rounded-md mt-2"
              placeholder="Enter customer phone number"
            />
            <label className="mt-4 font-bold">Wallet : Rs.{walletamt}</label>
        
            <button
              className="bg-green-500 text-white w-full py-2 mt-4 rounded-lg"
              onClick={handlePayment}
            >
              Pay ₹{total}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Pos;
