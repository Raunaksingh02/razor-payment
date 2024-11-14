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
  const [location,setlocation]= useState("");
  const [cash, setCash] = useState(0);
  const [category, setCategory] = useState('All');
  const [whatsappNumbers, setWhatsappNumbers] = useState([]);
  const [selectedNumber, setSelectedNumber] = useState(null);
  const [showNumberModal, setShowNumberModal] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [showBill, setShowBill] = useState(false); 
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [walletamt,setwalletamt] = useState(0);
  const [finalAmount, setFinalAmount] = useState(0); // Final total after wallet
  const [message, setMessage] = useState("");
  const [walletApplied, setWalletApplied] = useState(false); // Track wallet application
  const [showCustomerForm, setShowCustomerForm] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    const randomCode = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedCode(randomCode);
    console.log(randomCode);
  }, [showQRModal]);

  const upiString = `upi://pay?pa=${upinumber}&pn=${upiname}&am=${finalAmount}&cu=INR&tn=${generatedCode}`;

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
      // Ensure that all required attributes according to the schema are included
      const paymentData = {
        // Example function for generating orderId
        name: customerName,           // Ensure customerEmail is set before calling this function
        amount: finalAmount,                     // Assuming total is the final payable amount
        customerTable: location || 'Table 1',  // Use the default if no table specified
        paymentmode: paymentMode,
        customerPhoneNo: customerPhone,    // Corrected to match schema
        status: 'pending',                 // Default status, can be set as needed
        cartforpayment: cart,              // Assuming `cart` is structured per `cartItemSchema`
                         // Current date as per schema default
      };
  
      // Make sure to define and validate all required fields used in `paymentData`
  
      const response = await axios.post('http://localhost:1000/api/payments', paymentData);
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

  const handlelocationChange = (e) => {
    const selectedMode = e.target.value;
    setlocation(selectedMode);
    console.log(selectedMode); // Logs the current selected value
};

 const handleVerify = () => {
    if (verificationCode === generatedCode) {
      setIsVerified(true);
      alert('Verification successful! You can proceed with the payment.');
    } else {
      alert('Invalid code. Please try again.');
    }
  };


  useEffect(() => {
    const savedNumbers = JSON.parse(localStorage.getItem('whatsappNumbers')) || [];
    setWhatsappNumbers(savedNumbers);
  }, []);

  // Save numbers to localStorage whenever the list updates
  useEffect(() => {
    localStorage.setItem('whatsappNumbers', JSON.stringify(whatsappNumbers));
  }, [whatsappNumbers]);

  // Open WhatsApp with the KOT message for selected number
  const whatsappkot = () => {
    const message = cart
      .map((item) => `Name: ${item.name}\nQuantity: ${item.quantity}\nPrice: ${item.price}\n\n`)
      .join('');
    if (selectedNumber) {
      const whatsappLink = `https://api.whatsapp.com/send?phone=${selectedNumber.phone}&text=${encodeURIComponent(message)}`;
      window.open(whatsappLink, '_blank');
      setShowNumberModal(false);
    }
  };

  // Add a new number to the list
  const addNumber = () => {
    if (newName && newPhone) {
      const newNumber = { name: newName, phone: newPhone };
      setWhatsappNumbers([...whatsappNumbers, newNumber]);
      setNewName('');
      setNewPhone('');
    }
  };

  // Delete a number from the list
  const deleteNumber = (index) => {
    const updatedNumbers = whatsappNumbers.filter((_, i) => i !== index);
    setWhatsappNumbers(updatedNumbers);
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

      <div>
      <div className="fixed bottom-0 left-0 w-full bg-white p-4 shadow-lg">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-gray-600">Total Items: {quantity}</p>
            <p className="text-lg font-bold">Total: ₹{total}</p>
          </div>
          <div>
            <button
              className="bg-green-500 text-white px-6 py-2 mr-2 rounded-lg"
              onClick={() => setShowNumberModal(true)}
            >
              KOT
            </button>
            <button
              className="bg-[#f6931e] text-white px-6 py-2 rounded-lg"
              onClick={() => setShowBill(!showBill)}
            >
              {showBill ? 'Hide Bill' : 'Show Bill'}
            </button>
          </div>
        </div>
      </div>

      {/* Modal for WhatsApp number selection */}
      {showNumberModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Select WhatsApp Number</h2>

            {/* List of saved numbers */}
            {whatsappNumbers.length > 0 ? (
              <ul className="mb-4">
                {whatsappNumbers.map((num, index) => (
                  <li
                    key={index}
                    className={`flex justify-between items-center mb-2 p-2 rounded-lg cursor-pointer 
                      ${selectedNumber && selectedNumber.phone === num.phone ? 'bg-green-100' : 'hover:bg-gray-300'}`}
                    onClick={() => setSelectedNumber(num)}
                  >
                    <span>{num.name} - {num.phone}</span>
                    <button
                      className="text-red-500"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent the click event from selecting this number
                        deleteNumber(index);
                      }}
                    >
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mb-4 text-gray-600">No numbers saved yet.</p>
            )}

            {/* Add new number */}
            <div className="flex mb-4">
              <input
                type="text"
                placeholder="Name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="border p-2 mr-2 w-full rounded-lg"
              />
              <input
                type="text"
                placeholder="Phone"
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
                className="border p-2 mr-2 w-full rounded-lg"
              />
              <button className="bg-blue-500 text-white px-4 py-2 rounded-lg" onClick={addNumber}>
                Add
              </button>
            </div>

            {/* Confirm and Close buttons */}
            <div className="flex justify-end">
              <button className="bg-green-500 text-white px-4 py-2 mr-2 rounded-lg" onClick={whatsappkot}>
                Send KOT
              </button>
              <button className="bg-gray-500 text-white px-4 py-2 rounded-lg" onClick={() => setShowNumberModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
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
          
            <label className="block text-lg font-bold mb-2 mt-3">Payment Mode:</label>
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
            

            <div className="mt-4">
            <label className="block text-lg font-bold mb-2">Location:</label>
            <select
              className="w-full p-2 border rounded-md text-gray-600"
              value={location}
                onChange={handlelocationChange}  
             >
             <option value="PickUp">PickUp</option>
              <option value="Table 1">Table 1</option>
              <option value="Table 2">Table 2</option>
              <option value="Table 3">Table 3</option>
            </select>
            <div>
          

            {showQRModal && (
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-11/12 sm:w-1/2 md:w-1/3">
            <h2 className="text-2xl font-semibold mb-4">Scan UPI QR Code</h2>
            <div className="flex justify-center mb-4">
              {/* Render QR Code with UPI details */}
              <QRCode 
                value={upiString}
                size={256}
                level="H" 
                includeMargin={true} 
              />
              </div>
             <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">
                Enter Verification Code
              </label>
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400"
                placeholder="Enter 4-digit code"
              />
              </div>
              <button
              onClick={handleVerify}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200 mr-2"
              >
              Verify
              </button>
               <button
               onClick={() => {
                if (isVerified) {
                  setShowQRModal(false);
                } else {
                  alert('Please complete verification first.');
                }
              }}
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














