import React, { useState, useEffect, useContext } from 'react';
import { MdDelete } from 'react-icons/md';
import axios from 'axios';
import { BuyerContext } from './components/Buyercontext.js';
import QRCode from 'qrcode.react';
import { UPIDetailsContext } from "./components/UPIDetailsContext.js";


const Pos = () => {
  const { walletamount, customerDetails } = useContext(BuyerContext);
  const [items, setItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [paymentMode, setPaymentMode] = useState('');
  const [showQRModal, setShowQRModal] = useState(false);
  const { upinumber, upiname } = useContext(UPIDetailsContext);
  const [cash, setCash] = useState(0);
  const [category, setCategory] = useState('All');
  const [showBill, setShowBill] = useState(false); 
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [walletamt,setwalletamt] = useState(0);
  const [finalAmount, setFinalAmount] = useState(0); // Final total after wallet
  const [message, setMessage] = useState("");
  const [walletApplied, setWalletApplied] = useState(false); // Track wallet application
  const [showCustomerForm, setShowCustomerForm] = useState(false);


  const upiString = `upi://pay?pa=${upinumber}&pn=${upiname}&am=${finalAmount}&cu=INR`;

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
        const response = await axios.get(`http://localhost:1000/api/customer/${customerPhone}`);
        setwalletamt(response.data.wallet);
        console.log(response.data);
      } catch (error) {
        console.error('Error fetching wallet:', error);
      }
    };
    fetchwallet(); 
  }, [customerPhone]);

  useEffect(() => {
    calculateTotal();
}, [cart, discount, walletApplied]);


  const calculateTotal = () => {
    let baseAmount = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    baseAmount -= discount;
    let updatedAmount = walletApplied && baseAmount > walletamt ? baseAmount - walletamt : baseAmount;
    setTotal(baseAmount); // Set raw total
    setFinalAmount(updatedAmount); // Set final total considering wallet
    let totalQuantity = cart.reduce((acc, item) => acc + item.quantity, 0);
    setQuantity(totalQuantity);
};

  const addToCart = (item, size = '', price = '') => {
    if (!size) {
      size = item.sizes[0].size;
      price = item.sizes[0].price;
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
      setCart([...cart, { ...item, id: item._id, size, price, quantity: 1 }]);
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
        cartforpayment:cart,
        discountamount:total,
        paymentMode,
        customerName,
        customerPhonenNo:customerPhone
      };
      const response = await axios.post('http:localhost:1000/api/payments', paymentData);
      alert('Payment successful!');
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed. Please try again.');
    }
  };


  const handleWalletToggle = () => {
    setWalletApplied(!walletApplied);
};

// useEffect to recalculate whenever wallet toggle or cart updates

// In render function, showing Final Amount if Wallet is used
{walletApplied && finalAmount !== total && (
    <p className="text-gray-800 font-semibold">After Wallet Deduction: ₹{finalAmount}</p>
)}
  const handleCategoryChange = (selectedCategory) => {
    setCategory(selectedCategory);
  };

  
  const handlePaymentChange = (e) => {
    const selectedMode = e.target.value;
    setPaymentMode(selectedMode);

    // Open QR modal if UPI is selected
    if (selectedMode === 'UPI') {
      setShowQRModal(true);
    } else {
      setShowQRModal(false);
    }
  };


  return (
    <div className="h-screen flex flex-col justify-between">
      <h2 className="text-2xl font-bold mb-4">POS System</h2>
      {/* Items Grid */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        {items.filter(item => category === 'All' || item.category === category).map((item) => (
          <div key={item._id} className="w-40 ">
            <img src={item.image} alt={item.name} className="h-20 w-20 object-cover mx-auto" />
            <h4 className="text-lg font-bold text-center">{item.name}</h4>
            <div className="mt-2">
              <select
                id={`size-select-${item._id}`}
                className="w-30 p-2 border rounded-md mr-4 text-gray-600"
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
            <div className="flex justify-center items-center mt-2">
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
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold mb-2">Bill Summary</h3>
            <div>
            <button
                onClick={() => setShowCustomerForm(!showCustomerForm)}
                className=" px-4 py-2 bg-[#f6931e] text-white rounded-lg font-bold hover:bg-[#f6931e] focus:outline-none"
            >
              + Add
            </button>
            </div>
            <button
              className="text-gray-500"
              onClick={() => setShowBill(false)}
            >
              Close
            </button>
          </div>
           {/* Render form on "Add Customer" button click */}
           {showCustomerForm && (
                <div className="mt-4">
                     <label className="block text-lg font-bold mb-2">Name:</label>
                    <input
                        type="text"
                        className="w-full p-2 border rounded-md text-gray-600"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                    />
                    <label className="block text-lg font-bold mb-2">Phone No:</label>
                    <input
                        type="number"
                        className="w-full p-2 border rounded-md text-gray-600"
                        value={customerPhone}
                        onChange={(e) => setCustomerPhone(e.target.value)}
                    />
                    
                    {/* Wallet option */}
                    <label className="flex items-center cursor-pointer mt-2">
                        <input
                            type="checkbox"
                            checked={walletApplied}
                            onChange={handleWalletToggle}
                            className="form-checkbox text-blue-600 h-5 w-5 mr-2"
                        />
                        <span className="text-gray-700">Apply Wallet: ₹{walletamt}</span>
                    </label>
                    
                    {/* Wallet usage warning */}
                    {walletApplied && total < walletamt && (
                        <p className="text-red-500 text-sm mt-1">Add more items to use wallet balance.</p>
                    )}
                </div>
            )}
          {cart.length === 0 ? (
            <p>No items in the cart.</p>
          ) : (
            cart.map((item, index) => (
              <div key={index} className="flex justify-between border-b pb-2 mb-2">
                <div>
                <h4 className="text-lg font-bold">{item.name}</h4>
                <p>Size: {item.size}</p>
                <p>Quantity: {item.quantity}</p>
                <p>Price: ₹{item.price * item.quantity}</p>
                </div>
                <div>
                <button
                  className="text-red-500"
                  onClick={() => removeFromCart(item.id, item.size)}
                >
                  <MdDelete size={24} />
                </button>
                </div>
              </div>
            ))
          )}

            {/* Payment Section */}
          <div className="mt-4">
            <label className="block text-lg font-bold mb-2">Payment Mode:</label>
            <select
              className="w-full p-2 border rounded-md text-gray-600"
              value={paymentMode}
              onChange={handlePaymentChange}
            >
              <option value="">Choose payment mode</option>
              <option value="Cash">Cash</option>
              <option value="UPI">UPI</option>
              <option value="Wallet">Wallet</option>
            </select>
            <div>
           {/* Add Customer Button */}
           {/* QR Modal */}
           {showQRModal && (
           <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
           < div className="bg-white rounded-lg shadow-lg p-6 w-11/12 sm:w-1/2 md:w-1/3">
            <h2 className="text-2xl font-semibold mb-4">Scan UPI QR Code</h2>
            <div className="flex justify-center mb-4">
              {/* Render QR Code with UPI details */}
              <QRCode value={upiString}
                size={256} // Increase this value for higher resolution
                level="H" // High error correction for better scanning
                includeMargin={true}
               />
            </div>
            <button
              onClick={() => setShowQRModal(false)}
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-200"
            >
           Close
          </button>
           </div>
           </div>
          )}
          </div>
          <button
              className="mt-4 w-full bg-[#f6931e] text-white px-6 py-2 rounded-lg"
              onClick={handlePayment}
            >
              Pay ₹{finalAmount}
            </button>          
          </div>
        </div>
      )}
    </div>
  );
};

export default Pos;














